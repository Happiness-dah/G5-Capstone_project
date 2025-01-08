
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import airtimeRoutes from './routes/airtimeRoutes.js';
import billsRoutes from './routes/billsRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/bills', billsRoutes);

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use('/api/auth', authRoutes);

//paystack
app.use('/api/conversion', airtimeRoutes);

app.use(errorHandler);

// Handle 404 error response
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
