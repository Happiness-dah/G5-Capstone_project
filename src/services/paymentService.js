// services/paymentService.js

import Transactions from '../models/Transactions.js';
import BankRecord from '../models/BankRecord.js'; // Assuming a BankRecord model exists

const reconcile = async () => {
  try {
    // Fetch all pending transactions
    const transactions = await Transactions.findAll({
      where: { status: 'pending' },
    });

    // Fetch bank records (you may want to adjust this model as per your needs)
    const bankRecords = await BankRecord.findAll();

    const reconciledData = [];

    transactions.forEach((transaction) => {
      const matchingRecord = bankRecords.find(
        (record) => record.reference_id === transaction.reference_id
      );

      if (matchingRecord) {
        reconciledData.push({
          transactionId: transaction.id,
          platformAmount: transaction.amount,
          bankAmount: matchingRecord.amount,
          status: 'reconciled',
        });
      } else {
        reconciledData.push({
          transactionId: transaction.id,
          platformAmount: transaction.amount,
          status: 'not matched',
        });
      }
    });

    return reconciledData;
  } catch (error) {
    throw new Error('Error during payment reconciliation: ' + error.message);
  }
};

export default { reconcile };
