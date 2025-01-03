import express from 'express';
const router = express.Router();
import fetchTransactionHistory  from '../controllers/transactionController.js'; // Import the controller

// Define route for transaction history
router.get('/history', fetchTransactionHistory); // Expose API via GET request

module.exports = router;
