import express from 'express'; // Import the controller
import fetchTransactionHistory from '../controllers/transactionController.js';
import getTransactionHistory from '../services/history.js'; // Import the service to get transaction history
import { Op } from 'sequelize'; // For Sequelize operators
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger'; // Swagger documentation config

const router = express.Router();
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
