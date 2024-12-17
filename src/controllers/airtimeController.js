import https from 'https';
import dotenv from 'dotenv';
import AirtimeConversion from '../models/AirtimeConversion.js';
import User from '../models/User.js';

dotenv.config();

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

// Initialize Airtime Conversion
export const initializeAirtimeConversion = async (req, res) => {
  const { user_id, amount, telecom_provider, phone } = req.body;

  if (!user_id || !amount || !telecom_provider || !phone) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID, amount, telecom provider, and phone number are required',
    });
  };
  const user = await User.findOne({ where: { email } });
  const params = JSON.stringify({
    amount: amount * 100, // Convert to kobo (smallest currency unit for Paystack)
    email: `${user.email}`, // Dummy email, replace with user email if available
    currency: 'NGN', // Change to your target currency if needed
    mobile_money: {
      phone,
      provider: telecom_provider,
    },
  });
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/charge',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
  };
  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', async () => {
      const result = JSON.parse(data);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Save transaction to database
        try {
          const airtimeConversion = await AirtimeConversion.create({
            user_id,
            amount,
            telecom_provider,
            phone,
            paystack_reference: result.data.reference,
          });

          res.status(201).json({
            status: 'success',
            message: 'Airtime conversion initialized successfully',
            data: {
              airtimeConversion,
              paystackResponse: result.data,
            },
          });
        } catch (dbError) {
          res.status(500).json({
            status: 'error',
            message: 'An error occurred while saving the airtime conversion to the database',
          });
        }
      } else {
        res.status(response.statusCode).json({
          status: 'error',
          message: result.message || 'An error occurred with the Paystack API',
        });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while communicating with Paystack',
    });
  });

  request.write(params);
  request.end();
};
