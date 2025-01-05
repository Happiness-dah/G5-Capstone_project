import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const VTU_AFRICA_API_KEY = process.env.VTU_AFRICA_API_KEY;

// Resolve bank account details using Paystack
const resolveBankAccount = async (bankCode, acct_number) => {
  const resolveUrl = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(acct_number)}&bank_code=${encodeURIComponent(bankCode)}`;

  try {
    const resolveResponse = await fetch(resolveUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Cache-Control': 'no-cache',
      },
    });

    const resolveData = await resolveResponse.json();

    if (!resolveResponse.ok) {
      throw new Error(resolveData.error || 'An error occurred while resolving the bank account.');
    }

    return resolveData.data;
  } catch (error) {
    throw new Error(`Internal server error: ${error.message}`);
  }
};

// Create transfer recipient using Paystack
const createTransferRecipient = async (recipientDetails) => {
  const transferRecipientUrl = 'https://api.paystack.co/transferrecipient';

  try {
    const transferRecipientResponse = await fetch(transferRecipientUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipientDetails),
    });

    const transferRecipientData = await transferRecipientResponse.json();

    if (!transferRecipientResponse.ok) {
      throw new Error(transferRecipientData.error || 'An error occurred while creating the transfer recipient.');
    }

    return transferRecipientData.data;
  } catch (error) {
    throw new Error(`Internal server error: ${error.message}`);
  }
};

// Initiate transfer using Paystack
const initiateTransfer = async (amount, recipientCode, reason) => {
  const transferUrl = 'https://api.paystack.co/transfer';

  try {
    const transferResponse = await fetch(transferUrl, {
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

    const transferData = await transferResponse.json();

    if (!transferResponse.ok) {
      throw new Error(transferData.error || 'An error occurred while initiating the transfer.');
    }

    return transferData.data;
  } catch (error) {
    throw new Error(`Internal server error: ${error.message}`);
  }
};

// Initiate VTU Africa transfer
const initiateVtuTransfer = async (amount, recipientDetails) => {
  const vtuUrl = 'https://api.vtu.africa/transfer';

  try {
    const response = await fetch(vtuUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VTU_AFRICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        recipient: recipientDetails,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred while initiating the VTU transfer.');
    }

    return data;
  } catch (error) {
    throw new Error(`VTU Africa API error: ${error.message}`);
  }
};

// Transfer to user's bank account
export const transferToUserBank = async (req, res) => {
  const { bankCode, acct_number, amount, recipientName, useVtu } = req.body;

  if (!bankCode || !acct_number || !amount || !recipientName) {
    return res.status(400).json({
      result: 'fail',
      error: 'Invalid input parameters.',
    });
  }

  try {
    if (useVtu) {
      const recipientDetails = { bankCode, acct_number, recipientName };
      const vtuResponse = await initiateVtuTransfer(amount, recipientDetails);
      return res.status(200).json({
        result: 'success',
        data: vtuResponse,
      });
    } else {
      // Resolve bank account
      const resolvedAccount = await resolveBankAccount(bankCode, acct_number);

      // Create transfer recipient
      const recipientDetails = {
        type: 'nuban',
        name: recipientName,
        account_number: acct_number,
        bank_code: bankCode,
        currency: 'NGN',
      };
      const transferRecipient = await createTransferRecipient(recipientDetails);

      // Initiate transfer
      const transferData = await initiateTransfer(amount, transferRecipient.recipient_code, 'Transfer to user bank account');

      return res.status(200).json({
        result: 'success',
        data: transferData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: 'fail',
      error: error.message,
    });
  }
};

// Transfer to third party's bank account
export const transferToThirdPartyBank = async (req, res) => {
  const { bankCode, acct_number, amount, recipientName, useVtu } = req.body;

  if (!bankCode || !acct_number || !amount || !recipientName) {
    return res.status(400).json({
      result: 'fail',
      error: 'Invalid input parameters.',
    });
  }

  try {
    if (useVtu) {
      const recipientDetails = { bankCode, acct_number, recipientName };
      const vtuResponse = await initiateVtuTransfer(amount, recipientDetails);
      return res.status(200).json({
        result: 'success',
        data: vtuResponse,
      });
    } else {
      // Resolve bank account
      const resolvedAccount = await resolveBankAccount(bankCode, acct_number);

      // Create transfer recipient
      const recipientDetails = {
        type: 'nuban',
        name: recipientName,
        account_number: acct_number,
        bank_code: bankCode,
        currency: 'NGN',
      };
      const transferRecipient = await createTransferRecipient(recipientDetails);

      // Initiate transfer
      const transferData = await initiateTransfer(amount, transferRecipient.recipient_code, 'Transfer to third party bank account');

      return res.status(200).json({
        result: 'success',
        data: transferData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: 'fail',
      error: error.message,
    });
  }
};