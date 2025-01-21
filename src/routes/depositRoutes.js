import express from 'express'
import * as deposit from '../controllers/depositController.js'
import {
  protectUser,
  checkSessionValidity
} from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /deposits:
 *   post:
 *     summary: Create a new deposit
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID making the deposit
 *                 example: "12345"
 *               amount:
 *                 type: number
 *                 description: Amount to deposit
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Deposit created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', protectUser, checkSessionValidity, deposit.createDeposit)

/**
 * @swagger
 * /deposits/get/{id}:
 *   get:
 *     summary: Fetch deposit details
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit ID
 *     responses:
 *       200:
 *         description: Deposit details fetched successfully
 *       404:
 *         description: Deposit not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/get/:id',
  protectUser,
  checkSessionValidity,
  deposit.getDepositDetails
)

/**
 * @swagger
 * /deposits/update/{id}:
 *   put:
 *     summary: Update deposit status
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the deposit
 *                 example: "successful"
 *     responses:
 *       200:
 *         description: Deposit status updated successfully
 *       404:
 *         description: Deposit not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/update/{id}',
  protectUser,
  checkSessionValidity,
  deposit.updateDepositStatus
)

router.post(
  '/getKey',
  protectUser,
  checkSessionValidity,
  deposit.processRequest
)

export default router
