import https from 'https';
import AirtimeConversion from '../models/AirtimeConversion.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

// Initialize Airtime Conversion
// Initialize Airtime Conversion
const initializeAirtimeConversion = async (req, res) => {
  const { user_id, amount, telecom_provider, phone, email,  } = req.body;

  if (!user_id || !amount || !telecom_provider || !phone || !email) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID, amount, telecom provider, phone number, and email are required',
    });
  }

  try {
    const user = await User.find({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    // Default to NGN but allow fallback
    const currency ="NGN";
    const params = JSON.stringify({
      "amount": amount * 100,
      "email": email,
      "currency": "NGN",
      "mobile_money": { phone, provider: telecom_provider },
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

    const paystackReq = https.request(options, (paystackRes) => {
      let data = '';
      paystackRes.on('data', (chunk) => {
        data += chunk;
      });
      paystackRes.on('end', async () => {
        const result = JSON.parse(data);
        if (paystackRes.statusCode === 200 || paystackRes.statusCode === 201) {
          try {
            const airtimeConversion = await AirtimeConversion.create({
              user_id,
              amount,
              telecom_provider,
              phone,
              paystack_reference: result.data.reference,
            });
            return res.status(201).json({
              status: 'success',
              message: 'Airtime conversion initialized successfully',
              data: {
                airtimeConversion,
                paystackResponse: result.data,
              },
            });
          } catch (dbError) {
            return res.status(500).json({
              status: 'error',
              message: 'Database save error',
            });
          }
        } else {
          if (result.data?.message === 'Currency not yet supported') {
            return res.status(400).json({
              status: 'error',
              message: 'Currency not supported. Use NGN or contact support.',
              details: result.data,
            });
          }
          return res.status(paystackRes.statusCode).json({
            status: 'error',
            message: result.message || 'Paystack API error',
            details: result,
          });
        }
      });
    }); 
    paystackReq.on('error', (error) => {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Paystack communication error',
      });
    });
    paystackReq.write(params);
    paystackReq.end();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};

export default initializeAirtimeConversion;
