import Transactions from '../models/Transactions.js';
import airtimeConversion from '../models/AirtimeConversion.js';
import Debit from '../models/Debit.js';
import Deposit from '../models/Deposits.js';
import BillsPayments from '../models/BillPayments.js';

const getTransactionHistory = async (filters) => {
  try {
    const queryOptions = {
      where: {},
      order: [['createdAt', 'DESC']],
    };

    if (filters.userId) {
      queryOptions.where.userId = filters.userId;
    }
    if (filters.transactionType) {
      queryOptions.where.transaction_type = filters.transactionType;
    }
    if (filters.startDate && filters.endDate) {
      queryOptions.where.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const transactions = await Transactions.findAll(queryOptions);

    if (transactions.length === 0) {
      return { status: 'success', message: 'No transactions found', data: [] };
    }

    const detailedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const { transaction_type, reference_number } = transaction;

        if (transaction_type === 'airtime conversion') {
          const airtimeConversions = await airtimeConversion.findByPk(reference_number);
          return { ...transaction.toJSON(), details: airtimeConversions };
        } else if (transaction_type === 'debit') {
          const debitTransaction = await Debit.findByPk(reference_number);
          return { ...transaction.toJSON(), details: debitTransaction };
        } else if (transaction_type === 'credit') {
          const creditTransaction = await Deposit.findByPk(reference_number);
          return { ...transaction.toJSON(), details: creditTransaction };
        } else if (transaction_type === 'airtime buying') {
          const BillsPayment = await BillsPayments.findByPk(reference_number);
          return { ...transaction.toJSON(), details: BillsPayment };
        } else {
          return { ...transaction.toJSON(), details: null };
        }
      })
    );

    return { status: 'success', message: 'Transaction history retrieved', data: detailedTransactions };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default getTransactionHistory;
