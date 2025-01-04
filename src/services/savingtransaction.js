import Transactions from '../models/Transactions.js';
import AirtimeConversion from '../models/AirtimeConversion.js';
import Debit from '../models/Debit.js';
import Deposit from '../models/Deposits.js';
import BillPayments from '../models/BillPayments.js';
import User from '../models/User.js';

const saveTransaction = async (transactionData) => {
  const { userId, type, amount, referenceId, status = 'pending', details } = transactionData;

  try {
    // Begin a database transaction
    const result = await Transactions.sequelize.transaction(async (t) => {
      // Save the main transaction record
      const transaction = await Transactions.create(
        {
          user_id: userId,
          type,
          reference_id: referenceId,
          amount,
          status,
        },
        { transaction: t }
      );

      let relatedRecord;

      // Save related records based on the transaction type
      if (type === 'airtime_conversion') {
        const { telecomProvider, phone } = details;

        // Use the transaction's id as the foreign key
        relatedRecord = await AirtimeConversion.create(
          {
            reference_id: referenceId, // Correct FK relationship
            user_id: userId,
            amount,
            telecom_provider: telecomProvider,
            phone,
          },
          { transaction: t }
        );

        // Update user balance (add amount for airtime conversion)
        const user = await User.findByPk(userId, { transaction: t });
        if (user) {
          user.account_balance += amount;
          await user.save({ transaction: t });
        }
      } else if (type === 'debit') {
        const { recipient, remarks } = details;
        relatedRecord = await Debit.create(
          {
            reference_id: referenceId, // Correct FK relationship
            user_id: userId,
            amount,
            recipient,
            remarks: remarks || null,
          },
          { transaction: t }
        );

        // Update user balance (subtract amount for debit)
        const user = await User.findByPk(userId, { transaction: t });
        if (user) {
          user.account_balance -= amount;
          await user.save({ transaction: t });
        }
      } else if (type === 'deposit') {
        relatedRecord = await Deposit.create(
          {
            reference_id: referenceId, // Correct FK relationship
            user_id: userId,
            amount,
            status,
          },
          { transaction: t }
        );

        // Update user balance (add amount for deposit)
        const user = await User.findByPk(userId, { transaction: t });
        if (user) {
          user.account_balance += amount;
          await user.save({ transaction: t });
        }
      } else if (type === 'bill_payment') {
        const { billType, billProvider } = details;
        relatedRecord = await BillPayments.create(
          {
            reference_id: referenceId, // Correct FK relationship
            user_id: userId,
            amount,
            bill_type: billType,
            bill_provider: billProvider,
            status,
          },
          { transaction: t }
        );

        // Update user balance (subtract amount for bill payment)
        const user = await User.findByPk(userId, { transaction: t });
        if (user) {
          user.account_balance -= amount;
          await user.save({ transaction: t });
        }
      }

      // Return both the transaction and related record
      return {
        transaction,
        relatedRecord,
      };
    });

    return { status: 'success', message: 'Transaction saved successfully', data: result };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};


export default saveTransaction;
