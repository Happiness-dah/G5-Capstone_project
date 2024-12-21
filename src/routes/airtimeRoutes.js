import express from 'express';
import  initializeAirtimeConversion  from '../controllers/airtimeController.js';

const router = express.Router();

// Route to initialize airtime conversion

/**
 * @swagger
 * /airtime/initialize:
 *   post:
 *     summary: Initialize an airtime conversion
 *     description: Endpoint to initialize an airtime conversion with the Paystack API.
 *     tags: [Airtime Conversion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user making the conversion.
 *                 example: "12345"
 *               amount:
 *                 type: number
 *                 description: Amount to convert (in Naira).
 *                 example: 500
 *               telecom_provider:
 *                 type: string
 *                 description: Telecom provider name.
 *                 example: "MTN"
 *               phone:
 *                 type: string
 *                 description: Phone number to receive the airtime.
 *                 example: "08123456789"
 *     responses:
 *       201:
 *         description: Airtime conversion initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Airtime conversion initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     airtimeConversion:
 *                       type: object
 *                     paystackResponse:
 *                       type: object
 *       400:
 *         description: Bad request (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User ID, amount, telecom provider, and phone number are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An internal server error occurred
 */

router.post('/initialize', initializeAirtimeConversion);

export default router;
