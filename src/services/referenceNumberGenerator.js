import  Transactions  from '../models/Transactions.js'; // Adjust the import path for your transaction model

/**
 * Generates a unique reference number by checking the `reference_id` field in the `transactions` table.
 * @param {number} length - The length of the reference number.
 * @returns {Promise<string>} - A unique random numeric reference number.
 */
async function generateUniqueReference(length = 12) {
  const digits = '0123456789';

  const generateRandomNumber = () => {
    let reference = '';
    for (let i = 0; i < length; i++) {
      reference += digits[Math.floor(Math.random() * digits.length)];
    }
    return reference;
  };

  let uniqueReference;
  let isUnique = false;

  do {
    uniqueReference = generateRandomNumber();

    // Check if the generated reference already exists in the transactions table
    const existingTransaction = await Transactions.findOne({
      where: { reference_id: uniqueReference },
    });

    if (!existingTransaction) {
      isUnique = true;
    }
  } while (!isUnique);

  return uniqueReference;
}

export default generateUniqueReference;