const Transactions = require('./Transactions'); 
const airtimeConversion = require('./airtimeConversion'); 
const Debit = require('./Debit'); 
const Deposit = require('./Deposit');
const BillsPayments = require('./BillsPayments'); 

const { Transactions, airtimeConversion, Debit, Deposit, BillsPayments } = require('../models');

async function getTransactionHistory(filters) {
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

    const transactions = await Transaction.findAll(queryOptions);

    if (transactions.length === 0) {
      return { status: 'success', message: 'No transactions found', data: [] };
    }


    const detailedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const { transaction_type, reference_number } = transaction;

        if (transaction_type === 'airtime conversion') {
          const airtimeConversion = await AirtimeConversion.findByPk(reference_number);
          return { ...transaction.toJSON(), details: airtimeConversion };
        } else if (transaction_type === 'debit') {
          const debitTransaction = await DebitTransaction.findByPk(reference_number);
          return { ...transaction.toJSON(), details: debitTransaction };
        } else if (transaction_type === 'credit') {
          const creditTransaction = await CreditTransaction.findByPk(reference_number);
          return { ...transaction.toJSON(), details: creditTransaction };
        } else if (transaction_type === 'airtime buying') {
          const BillsPayments = await BillsPayments.findByPk(reference_number);
          return { ...transaction.toJSON(), details: BillsPayments };
        } else {
          return { ...transaction.toJSON(), details: null };
        }
      })
    );

    return { status: 'success', message: 'Transaction history retrieved', data: detailedTransactions };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

module.exports = { getTransactionHistory };
