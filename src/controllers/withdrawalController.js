import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const VTU_AFRICA_API_KEY = process.env.VTU_AFRICA_API_KEY;

// Resolve bank account details using Paystack
export const resolveBankAccount = async (req, res) => {
  const { bankCode, acct_number } = req.body;

  if (!bankCode || !acct_number) {
    return res.status(400).json({
      result: 'fail',
      error: 'Invalid input parameters.',
    });
  }

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
      return res.status(400).json({
        result: 'fail',
        error: resolveData.error || 'An error occurred while resolving the bank account.',
      });
    }

    return resolveData.data;
  } catch (error) {
    return res.status(500).json({
      result: 'fail',
      error: `Internal server error: ${error.message}`,
    });
  }
};

// Initiate VTU Africa withdrawal
export const initiateVtuWithdrawal = async (amount, recipientDetails) => {
  const vtuUrl = 'https://api.vtu.africa/withdrawal';

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
      throw new Error(data.error || 'An error occurred while initiating the VTU withdrawal.');
    }

    return data;
  } catch (error) {
    throw new Error(`VTU Africa API error: ${error.message}`);
  }
};

// Handle withdrawal
export const handleWithdrawal = async (req, res) => {
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
      const vtuResponse = await initiateVtuWithdrawal(amount, recipientDetails);
      return res.status(200).json({
        result: 'success',
        data: vtuResponse,
      });
    } else {
      // Resolve bank account
      const resolvedAccount = await resolveBankAccount(req, res);
      if (resolvedAccount.result === 'fail') {
        return res.status(400).json(resolvedAccount);
      }

      // Create transfer recipient
      const transferRecipientUrl = 'https://api.paystack.co/transferrecipient';
      const transferRecipientResponse = await fetch(transferRecipientUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: recipientName,
          account_number: acct_number,
          bank_code: bankCode,
          currency: 'NGN',
        }),
      });

      const transferRecipientData = await transferRecipientResponse.json();

      if (!transferRecipientResponse.ok) {
        return res.status(400).json({
          result: 'fail',
          error: transferRecipientData.error || 'An error occurred while creating the transfer recipient.',
        });
      }

      // Initiate transfer
      const transferUrl = 'https://api.paystack.co/transfer';
      const transferResponse = await fetch(transferUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'balance',
          amount: amount * 100, // Paystack expects amount in kobo
          recipient: transferRecipientData.data.recipient_code,
          reason: 'Withdrawal from wallet',
        }),
      });

      const transferData = await transferResponse.json();

      if (!transferResponse.ok) {
        return res.status(400).json({
          result: 'fail',
          error: transferData.error || 'An error occurred while initiating the transfer.',
        });
      }

      return res.status(200).json({
        result: 'success',
        data: transferData.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: 'fail',
      error: `Internal server error: ${error.message}`,
    });
  }
};