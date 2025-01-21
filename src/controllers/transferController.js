import fetch from 'node-fetch';
import dotenv from 'dotenv';
import resolveBankAccountPaystack from '../services/PaystackService.js'
import verifyBankDetailsVtu from '../services/VtuAfricaService.js'


// Load environment variables
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

// Function to verify account using VTU Africa
const verifyAccountVtuAfrica = async (accountNo, bankCode) => {
  const vtuUrl = `https://vtuafrica.com.ng/portal/api/merchant-verify/?apikey=${API_SECRET_KEY}&serviceName=BankTransfer&accountNo=${accountNo}&bankcode=${bankCode}`;

  try {
    const response = await fetch(vtuUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error verifying account with VTU Africa.');
    }

    return data;
  } catch (error) {
    throw new Error(`VTU Africa API error: ${error.message}`);
  }
};



// Verify account via VTU Africa or fallback to Paystack
export const verifyAccount = async (accountNo, bankCode) => {
  try {
    const vtuVerification = await verifyAccountVtuAfrica(accountNo, bankCode);

    if (vtuVerification.status !== 'fail') {
      return vtuVerification;
    }

    console.log('VTU Africa verification failed, falling back to Paystack...');
    return await resolveBankAccountPaystack(bankCode, accountNo);
  } catch (error) {
    throw new Error(`Account verification failed: ${error.message}`);
  }
};

// Create transfer recipient using Paystack
const createTransferRecipient = async (recipientDetails) => {
  const transferRecipientUrl = 'https://api.paystack.co/transferrecipient';

  try {
    const response = await fetch(transferRecipientUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipientDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error creating transfer recipient.');
    }

    return data.data;
  } catch (error) {
    throw new Error(`Paystack API error: ${error.message}`);
  }
};

// Initiate transfer using Paystack
const initiateTransfer = async (amount, recipientCode, reason) => {
  const transferUrl = 'https://api.paystack.co/transfer';

  try {
    const response = await fetch(transferUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Paystack expects amount in kobo
        recipient: recipientCode,
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error initiating transfer.');
    }

    return data.data;
  } catch (error) {
    throw new Error(`Paystack API error: ${error.message}`);
  }
};

// Check VTU Africa account balance
const checkVtuBalance = async () => {
  const balanceUrl = `https://vtuafrica.com.ng/portal/api/check-balance/?apikey=${API_SECRET_KEY}`;

  try {
    const response = await fetch(balanceUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error fetching VTU Africa balance.');
    }

    return data.balance;
  } catch (error) {
    throw new Error(`VTU Africa API error: ${error.message}`);
  }
};

// Exported functions for controllers
export const transferToUserBank = async (req, res) => {
  const { bankCode, acct_number, amount, recipientName, useVtu } = req.body;

  if (!bankCode || !acct_number || !amount || !recipientName) {
    return res.status(400).json({ result: 'fail', error: 'Invalid input parameters.' });
  }

  try {
    if (useVtu) {
      const vtuBalance = await checkVtuBalance();

      if (vtuBalance >= amount) {
        const vtuResponse = await initiateVtuTransfer(amount, { bankCode, acct_number, recipientName });
        return res.status(200).json({ result: 'success', data: vtuResponse });
      }
    }

    const resolvedAccount = await resolveBankAccountPaystack(bankCode, acct_number);
    const recipientDetails = {
      type: 'nuban',
      name: recipientName,
      account_number: acct_number,
      bank_code: bankCode,
      currency: 'NGN',
    };

    const recipient = await createTransferRecipient(recipientDetails);
    const transfer = await initiateTransfer(amount, recipient.recipient_code, 'Transfer to user bank account');

    return res.status(200).json({ result: 'success', data: transfer });
  } catch (error) {
    return res.status(500).json({ result: 'fail', error: error.message });
  }
};
