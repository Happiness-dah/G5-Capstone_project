import express from 'express';
import { payBill, getPaymentHistory } from '../controllers/billsController.js';

const router = express.Router();

router.post('/pay-bill', payBill); 
router.get('/history/:userId', getPaymentHistory);

export default router;
