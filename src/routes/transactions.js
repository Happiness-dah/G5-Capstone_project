import express from 'express';
const router = express.Router();
import fetchTransactionHistory  from '../controllers/transactionController.js'; // Import the controller

// Define route for transaction history
router.get('/', fetchTransactionHistory, async (req, res) => {
    const { userId, transactionType, startDate, endDate } = req.query;
  
    const filters = {
      userId,
      transactionType,
      startDate,
      endDate,
    };
  
    const result = await getTransactionHistory(filters);
  
    if (result.status === 'error') {
      return res.status(500).json(result);
    }
  
    res.status(200).json(result);
  });
  
  // Swagger UI for interactive documentation
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  export default router;
