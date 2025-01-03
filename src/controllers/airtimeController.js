import axios from 'axios';
import User from '../models/User.js';
import dotenv from 'dotenv';
import saveTransaction from '../services/savingtransaction.js';
import generateUniqueReference from '../services/referenceNumberGenerator.js';

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

    if ([101].includes(response.status)) {
      return res.status(200).json({
        status: 'success',
        message: result.description.message,
        phone: result.description.Phone_Number,
        data: result.description,
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
  const { user_id: userId, amount, network, Sender_phone: senderPhone, reciever_phone: receiverPhone } = req.body;

  // Validate required fields
  if (!userId || !amount || !network || !senderPhone || !receiverPhone) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID, amount, network, sender phone, and receiver phone are required.',
    });
  }

  try {
    const user = await User.findOne({ where: { id: userId }, attributes: ['email'] });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // Generate a unique reference ID
    const referenceId = await generateUniqueReference();

    // Construct the API URL
    const apiUrl = `https://vtuafrica.com.ng/portal/api-test/airtime-cash/?apikey=${apiKEY}&network=${network}&sender=${user.email}&sendernumber=${senderPhone}&amount=${amount}&sitephone=${receiverPhone}&ref=${referenceId}`;
    console.log(apiUrl);
    // Make the VTU Africa API request using axios
    const response = await axios.post(apiUrl);
    console.log(response);
    const result = response.data;


    if (result.status === 101) { // Assuming API's status is in `result.status`
      const transactionData = {
        userId,
        type: 'airtime_conversion',
        amount,
        referenceId,
        details: { network, senderPhone, receiverPhone },
      };

      const saveResult = await saveTransaction(transactionData);

      if (saveResult.status === 'error') {
        return res.status(500).json(saveResult);
      }

      return res.status(201).json({
        status: 'success',
        message: 'Airtime conversion completed successfully.',
        data: saveResult.data,
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: result.description?.message || 'API error.',
        details: result,
      });
    }
  } catch (error) {
    // Log error details for debugging
    console.error('Error:', error.message || error.response?.data);

    return res.status(500).json({
      status: 'error',
      message: error.response?.data?.message || error.message || 'Internal server error.',
    });
  }
};



export { initializeAirtimeConversion, CompleteAirtimeConversion };
