
import crypto from 'crypto';
import Transactions from '../models/Transactions.js'; // Adjust the path to your Sequelize models
//  directory
async function generateUniqueRef() {
  let unique = false;
  let ref;

  while (!unique) {
    // Generate a random reference ID
    ref = crypto.randomBytes(6).toString('hex').toUpperCase();

    // Check if it exists in the transaction table
    const existing = await Transactions.findOne({ where: { reference_id: ref } });
    if (!existing) {
      unique = true;
    }
  }

  return ref;
}

export default generateUniqueRef;