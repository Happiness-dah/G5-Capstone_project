import https from 'https';
import User from '../models/User.js';
import dotenv from 'dotenv';
import saveTransaction from '../services/savingtransaction.js';

dotenv.config();

const apiKEY = process.env.API_SECRET_KEY;

// Initialize Airtime Conversion
const initializeAirtimeConversion = async (req, res) => {
  const { user_id, amount, telecom_provider, phone, email } = req.body;

  // Validate required fields
  if (!user_id || !amount || !telecom_provider || !phone || !email) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID, amount, telecom provider, phone number, and email are required.',
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    const params = JSON.stringify({
      amount: amount * 100, // Convert amount to kobo
      email,
      currency: "NGN", // Explicitly setting NGN
      mobile_money: { phone, provider: telecom_provider },
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/charge',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKEY}`,
        'Content-Type': 'application/json',
      },
    };

    // Make the Paystack API request
    const ApiReq = https.request(options, (ApiRes) => {
      let data = '';

      ApiRes.on('data', (chunk) => {
        data += chunk;
      });

      ApiRes.on('end', async () => {
        const result = JSON.parse(data);

        if (ApiRes.statusCode === 200 || ApiRes.statusCode === 201) {
          const referenceId = result.data.reference;

          // Prepare transaction data for saving
          const transactionData = {
            userId: user_id,
            amount,
            type: 'airtime_conversion',
            referenceId,
            status: 'pending',
            details: {
              telecomProvider: telecom_provider,
              phone,
            },
          };

          try {
            // Save the transaction
            const savedTransaction = await saveTransaction(transactionData);

            return res.status(201).json({
              status: 'success',
              message: 'Airtime conversion initialized successfully.',
              data: savedTransaction,
            });
          } catch (dbError) {
            return res.status(500).json({
              status: 'error',
              message: 'Database save error.',
              error: dbError.message,
            });
          }
        } else {
          // Handle API errors
          const errorMessage =
            result.data?.message === 'Currency not yet supported'
              ? 'Currency not supported. Use NGN or contact support.'
              : result.message || 'API error.';

          return res.status(ApiRes.statusCode).json({
            status: 'error',
            message: errorMessage,
            details: result,
          });
        }
      });
    });

    // Handle communication errors
    ApiReq.on('error', (error) => {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'API communication error.',
      });
    });

    ApiReq.write(params);
    ApiReq.end();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error.',
    });
  }
};

export default initializeAirtimeConversion;
