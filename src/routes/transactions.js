const express = require('express');
const router = express.Router();
const { fetchTransactionHistory } = require('../controllers/transactionController'); // Import the controller

// Define route for transaction history
router.get('/history', fetchTransactionHistory); // Expose API via GET request

module.exports = router;
