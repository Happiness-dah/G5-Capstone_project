import express from 'express';
import * as usercontroller from '../controllers/userController.js';
import { protectUser, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();


/**
 * @swagger
 * /users/accountbalance:
 *   post:
 *     summary: get account balance
 *     description: fetching the user account balance.
 *     tags: [user]
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
 *                 description: Transaction ID to approve
 *                 example: "abcd1234-1234-5678-9101-112233445566"           
 *     responses:
 *       200:
 *         description: Successfully retrieved user account balance
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/accountbalance', protectUser, usercontroller.fetchAccountBalnce);

/**
 * @swagger
 * /users/fetchProduct:
 *   get:
 *     summary: geting all the product available
 *     description: fetching all the product available.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved product list
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/fetchProduct', protectUser, authorize('user'), usercontroller.fetchProduct);

/**
 * @swagger
 * /users/fetchBank:
 *   get:
 *     summary: getting all the bank names and their codes
 *     description: fetching all the bank names and code available.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bank list
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/fetchBank', protectUser, authorize('user'), usercontroller.FecthallBank);

/**
 * @swagger
 * /users/userDetails:
 *   get:
 *     summary: Get user details
 *     description: Fetch the user's details.
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/userDetails', protectUser, authorize('user'), usercontroller.fetchUserDetail);

export default router;
