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
        relatedRecord = await AirtimeConversion.create(
          {
            id: referenceId,
            user_id: userId,
            amount,
            telecom_provider: telecomProvider,
            phone,
            reference_id: referenceId,
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
            id: referenceId,
            user_id: userId,
            amount,
            recipient,
            remarks: remarks || null,
            reference_id: referenceId,
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
            id: referenceId,
            user_id: userId,
            amount,
            reference_id: referenceId,
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
            id: referenceId,
            user_id: userId,
            amount,
            bill_type: billType,
            bill_provider: billProvider,
            reference_id: referenceId,
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
