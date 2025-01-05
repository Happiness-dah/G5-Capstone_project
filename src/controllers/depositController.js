import Deposit from '../models/Deposits.js';
import User from '../models/User.js';
import generateUniqueReference from '../services/referenceNumberGenerator.js';
import saveTransaction from '../services/savingtransaction.js';

// Create a new deposit
export const createDeposit = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID and amount are required.',
      });
    }

   // Generate a unique reference ID
   const referenceId = await generateUniqueReference();

   // Save the deposit transaction
   const transactionData = {
     userId,
     type: 'deposit',
     amount,
     referenceId,
     status: 'pending',
   };

   const result = await saveTransaction(transactionData);

   if (result.status === 'error') {
     return res.status(500).json(result);
   }

    // Update user's account balance
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    user.balance += amount;
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Deposit created and balance updated successfully.',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch deposit details
export const getDepositDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const deposit = await Deposit.findByPk(id);
  
      if (!deposit) {
        return res.status(404).json({
          status: 'error',
          message: 'Deposit not found.',
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: deposit,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update deposit status
export const updateDepositStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const deposit = await Deposit.findByPk(id);
  
      if (!deposit) {
        return res.status(404).json({
          status: 'error',
          message: 'Deposit not found.',
        });
      }

      deposit.status = status;
      await deposit.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Deposit status updated successfully.',
        data: deposit,
      });
    } catch (error) {
      next(error);
    }
  };
  