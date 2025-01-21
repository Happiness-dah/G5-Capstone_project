import Deposit from '../models/Deposits.js'
import User from '../models/User.js'
import dotenv from 'dotenv'
import { saveTransaction } from '../services/savingtransaction.js'
dotenv.config()

// Create a new deposit
export const createDeposit = async (req, res, next) => {
  try {
    const { userId, amount, reference } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID and amount are required.',
      });
    }

    // Validate that the amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be a valid number greater than zero.',
      });
    }

    // Convert amount to a float for arithmetic operations
    const depositAmount = parseFloat(amount);

    // Set reference ID (use provided reference or generate a unique one)
    const referenceId = reference || generateUniqueReference(); // Replace with your logic to generate unique references

    // Save the deposit transaction
    const transactionData = {
      userId,
      type: 'deposit',
      amount: depositAmount,
      referenceId,
      status :'successful'
    };

    const result = await saveTransaction(transactionData);

    // Handle transaction save errors
    if (result.status === 'error') {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save transaction.',
        details: result.error || 'Unknown error occurred.',
      });
    }

    // Update user's account balance
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // Calculate and update the new balance
    const currentBalance = parseFloat(user.account_balance) || 0; // Ensure numeric conversion
    const newBalance = currentBalance + depositAmount;

    // Update and save the account balance
    user.account_balance = newBalance.toFixed(2); // Ensure 2 decimal places for consistency
    await user.save();

    // Log and send success response
    console.log('Deposit created and balance updated successfully:', result.data);
    res.status(200).json({
      status: 'success',
      message: 'Deposit created and account balance updated successfully.',
      data: {
        transaction: result.data,
        newBalance: parseFloat(newBalance.toFixed(2)), // Send as a number in the response
      },
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    next(error); // Pass the error to your global error handler
  }
};


// Fetch deposit details
export const getDepositDetails = async (req, res, next) => {
  try {
    const { id } = req.bddy

    const deposit = await Deposit.findByPk(id)

    if (!deposit) {
      return res.status(404).json({
        status: 'error',
        message: 'Deposit not found.'
      })
    }

    res.status(200).json({
      status: 'success',
      data: deposit
    })
  } catch (error) {
    next(error)
  }
}

// Update deposit status
export const updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const deposit = await Deposit.findByPk(id)

    if (!deposit) {
      return res.status(404).json({
        status: 'error',
        message: 'Deposit not found.'
      })
    }

    deposit.status = status
    await deposit.save()

    res.status(200).json({
      status: 'success',
      message: 'Deposit status updated successfully.',
      data: deposit
    })
  } catch (error) {
    next(error)
  }
}

export const processRequest = async (req, res) => {
  try {
    const { user_id, amount } = req.body

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      })
    }

    // Fetch user
    const user = await User.findOne({ where: { id: user_id } })
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    // Validate amount
    if (!amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount is required'
      })
    }

    // Ensure PAYSTACK_PUBLIC_KEY is set
    const publicKey = process.env.PAYSTACK_PUBLIC_KEY
    if (!publicKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Public key not configured'
      })
    }

    // Encode the public key in Base64
    const encodedPublicKey = Buffer.from(publicKey).toString('base64')

    // Send success response
    res.status(200).json({
      status: 'success',
      email: user.email,
      publicKey: encodedPublicKey,
      amount: amount
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred'
    })
  }
}
