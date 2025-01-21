import axios from 'axios';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { saveTransaction } from '../services/savingtransaction.js';
import https from 'https';
import generateUniqueRef from '../services/referenceNumberGenerator.js';

dotenv.config();

const apiKEY = process.env.API_SECRET_KEY;

// Initialize Airtime Conversion
const initializeAirtimeConversion = async (req, res) => {
  const { network } = req.body;

  // Validate required fields
  if (!network) {
    return res.status(400).json({
      status: 'error',
      message: 'Network provider is required.',
    });
  }

  try {
    // Make the VTU Africa API request using axios
    const response = await axios.get(
      `https://vtuafrica.com.ng/portal/api/merchant-verify/?apikey=${apiKEY}&serviceName=Airtime2Cash&network=${network}`
    );

    const result = response.data;
    console.log(result)
    if (result.code == 101) {
      return res.status(200).json({
        status: 'success',
        message: result.description.message,
        phone: result.description.Phone_Number,

      });
    } else {
      // Handle API errors
      return res.status(response.status).json({
        status: 'error',
        message: result.description || 'API error.',
        details: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.response?.data?.message || error.message || 'Internal server error.',
    });
  }
};

const CompleteAirtimeConversion = async (req, res) => {
  try {
    const {
      user_id: userId,
      amount,
      network,
      Sender_phone: senderPhone,
      reciever_phone: receiverPhone
    } = req.body;

    if (!userId || !amount || !network || !senderPhone || !receiverPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const ref = await generateUniqueRef();

    const queryParams = new URLSearchParams({
      apikey: apiKEY, 
      network,
      sender: senderPhone,
      sendernumber: senderPhone,
      amount,
      sitephone: receiverPhone,
      ref,
      webhookURL: 'http://testlink.com/webhook/', 
    });

    const url = `https://vtuafrica.com.ng/portal/api/airtime-cash/?${queryParams.toString()}`;

    https.get(url, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', async () => {
        try {
          const result = JSON.parse(data);

          if (result.code === 101) {
            // Save the transaction
            const status = result.description.status;
            if (status == "Processing") {
              status = "pending";
            }
            if (status == "Completed") {
              status = "successful"
            }
            const transactionData = {
              userId,
              type: 'airtime_conversion',
              amount,
              referenceId: ref,
              status: status,
              details: {
                telecomProvider: network,
                phone: senderPhone,
              },
            };

            const saveResult = await saveTransaction(transactionData);

            if (saveResult.status === 'success') {
              console.log(result);
              return res.status(200).json({
                status: 'success',
                message: result.description.message,
              });

            } else {
              return res.status(500).json({
                status: 'error',
                message: 'Transaction could not be saved.',
                error: saveResult.message,
              });
            }
          }

          // return res.status(200).json(result);
        } catch (error) {
          console.error('Error parsing JSON:', error.message);
          return res.status(500).json({ error: 'Failed to parse API response' });
        }
      });
    }).on('error', (err) => {
      console.error('Error:', err.message);
      return res.status(500).json({ error: 'Failed to make API request' });
    });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
};


export { initializeAirtimeConversion, CompleteAirtimeConversion };
