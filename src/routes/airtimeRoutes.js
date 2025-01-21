import express from 'express';
import * as conversion from '../controllers/airtimeController.js';
import { checkSessionValidity } from '../middleware/authMiddleware.js';
import { updateTransactionStatus } from '../services/savingtransaction.js';

const router = express.Router();

/**
 * @swagger
 * /airtime/initialize:
 *   post:
 *     summary: Initialize an airtime conversion
 *     description: Validates the network provider and initiates an airtime conversion process.
 *     tags: [Airtime Conversion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: string
 *                 description: The network provider for the airtime conversion.
 *                 example: "MTN"
 *     responses:
 *       200:
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
 *                   example: Initialization successful.
 *                 phone:
 *                   type: string
 *                   example: "08123456789"
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields
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
 *                   example: "Network provider is required."
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
 *                   example: "Internal server error."
 */


router.post('/initialize', checkSessionValidity, conversion.initializeAirtimeConversion);

/**
 * @swagger
 * /airtime/complete:
 *   post:
 *     summary: Complete an airtime conversion
 *     description: Completes an airtime conversion by sending necessary details to the API.
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
 *                 description: The user ID performing the conversion.
 *                 example: "12345"
 *               amount:
 *                 type: number
 *                 description: The amount of airtime to convert.
 *                 example: 500
 *               network:
 *                 type: string
 *                 description: The network provider for the airtime conversion.
 *                 example: "MTN"
 *               Sender_phone:
 *                 type: string
 *                 description: The sender's phone number.
 *                 example: "08123456789"
 *               reciever_phone:
 *                 type: string
 *                 description: The receiver's phone number.
 *                 example: "08198765432"
 *     responses:
 *       201:
 *         description: Airtime conversion completed successfully
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
 *                   example: "Airtime conversion completed successfully."
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields
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
 *                   example: "User ID, amount, network, sender phone, and receiver phone are required."
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
 *                   example: "Internal server error."
 */

router.post('/complete', checkSessionValidity, conversion.CompleteAirtimeConversion);

router.post('/webhook', async (req, res) => {
    try {
        // Acknowledge receipt quickly to avoid webhook timeouts
        res.status(200).send('Webhook received');

        // Extract and validate the payload
        const { ref, status, service, network, amount, credit, Charge, sender } = req.body;
        console.log(req.body)

        if (!ref || !status || !service || !amount) {
            console.error('Invalid webhook payload:', req.body);
            return;
        }

        // Ensure the webhook is for the expected service
        if (service !== 'Airtime2Cash') {
            console.warn('Unsupported service:', service);
            return;
        }

        // Log the received payload for debugging
        console.log('Received webhook payload:', req.body);

        // Process the webhook asynchronously
        if (status === 'Completed') {
            const Status = status;
            const update = await updateTransactionStatus({
                transactionId: ref,
                Status: Status,
                credit: parseFloat(credit),
                details: {
                    telecomProvider: network,
                    sender: sender,
                    amount: parseFloat(amount),
                    credit: parseFloat(credit),
                    charge: parseFloat(Charge),
                },
            });
            console.log(update)

        } else {
            console.warn(`Unhandled status: ${status}`);
        }
    } catch (error) {
        console.error('Webhook processing failed:', error);
    }
});

export default router;
