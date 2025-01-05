import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protectAdmin, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();



/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Monitor all users
 *     description: Retrieve a list of all users in the system for monitoring.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user list
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/users', protectAdmin, authorize('admin'), adminController.monitorUsers);

/**
 * @swagger
 * /admin/account-status:
 *   put:
 *     summary: Manage user account status
 *     description: Update the status (active, suspended, etc.) of a user account.
 *     tags: [Admin]
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
 *                 description: User ID whose status needs to be updated
 *                 example: "c84d18e9-dde2-4d55-bfeb-3741e28c0130"
 *               status:
 *                 type: string
 *                 description: New account status (active, suspended, etc.)
 *                 example: "suspended"
 *     responses:
 *       200:
 *         description: Account status updated successfully
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.put('/account-status', protectAdmin, authorize('admin'), adminController.manageAccountStatus);

/**
 * @swagger
 * /admin/approve-transaction:
 *   post:
 *     summary: Approve a transaction
 *     description: Approve a pending transaction for a user.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID to approve
 *                 example: "abcd1234-1234-5678-9101-112233445566"
 *     responses:
 *       200:
 *         description: Transaction approved successfully
 *       400:
 *         description: Bad request - Invalid transaction ID
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/approve-transaction', protectAdmin, authorize('admin'), adminController.approveTransaction);

/**
 * @swagger
 * /admin/refund:
 *   post:
 *     summary: Refund a transaction
 *     description: Refund a completed transaction to a user.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID to refund
 *                 example: "abcd1234-1234-5678-9101-112233445566"
 *               amount:
 *                 type: number
 *                 description: Amount to refund
 *                 example: 100.50
 *     responses:
 *       200:
 *         description: Transaction refunded successfully
 *       400:
 *         description: Bad request - Invalid transaction ID or amount
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/refund', protectAdmin, authorize('admin'), adminController.refundTransaction);


/**
 * @swagger
 * /admin/reconcile-payments:
 *   get:
 *     summary: Reconcile payments
 *     description: Reconciles payments made by users and processes any discrepancies.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments reconciled successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/reconcile-payments', protectAdmin, authorize('admin'), adminController.reconcilePayments);

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: View audit logs
 *     description: Retrieve logs of activities performed by users or the system.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved audit logs
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/audit-logs', protectAdmin, authorize('admin'), adminController.viewAuditLogs);

/**
 * @swagger
 * /admin/notifications:
 *   post:
 *     summary: Send notifications
 *     description: Send a notification to users for updates or alerts.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message to be sent to users
 *                 example: "System maintenance will start tomorrow at 10 PM."
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Bad request - Invalid message format
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/notifications', protectAdmin, authorize('admin'), adminController.sendNotifications);

/**
* /admin/reports:
 *   get:
 *     summary: generate report
 *     description: Generate report.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated report
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/reports', protectAdmin, authorize('admin'), adminController.generateReport);

/**
 * @swagger
 * /admin/platform-settings:
 *   post:
 *     summary: Update platform settings
 *     description: Update configuration settings for the platform (e.g., payment gateway, service options).
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 description: Configuration settings for the platform
 *                 example: { "serviceFee": 2.5, "currency": "USD" }
 *     responses:
 *       200:
 *         description: Platform settings updated successfully
 *       400:
 *         description: Bad request - Invalid settings data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/platform-settings', protectAdmin, authorize('admin'), adminController.updatePlatformSettings);

/**
 * @swagger
 * /admin/createproduct:
 *   post:
 *     summary: Create a new product
 *     description: Allows admin to create a new product with all necessary details.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Example Product"
 *               description:
 *                 type: string
 *                 description: Detailed description of the product
 *                 example: "This is an example product description."
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 100.00
 *               discount:
 *                 type: number
 *                 description: Discount on the product (if any)
 *                 example: 10.00
 *               currency:
 *                 type: string
 *                 description: Currency for the product price
 *                 example: "USD"
 *               isActive:
 *                 type: boolean
 *                 description: Whether the product is active
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/createproduct', protectAdmin, authorize('admin'), adminController.createProduct);

/**
 * @swagger
 * /admin/fetchSingleProduct:
 *   get:
 *     summary: Fetch single product
 *     description: Retrieve details of a single product by its ID.
 *     tags: 
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to fetch.
 *     responses:
 *       200:
 *         description: Product fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Product details
 *       400:
 *         description: Bad request - Missing or invalid product ID.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 *       404:
 *         description: Product not found.
 */
router.get('/fetchSingleProduct', protectAdmin, authorize('admin'), adminController.fetchSingleProduct);

/**
 * @swagger
 * /admin/updateproduct:
 *   put:
 *     summary: Update an existing product
 *     description: Allows admin to update details of an existing product by its ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the product to be updated
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Updated name of the product
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 description: Updated description of the product
 *                 example: "Updated product description."
 *               price:
 *                 type: number
 *                 description: Updated price of the product
 *                 example: 120.00
 *               discount:
 *                 type: number
 *                 description: Updated discount for the product
 *                 example: 15.00
 *               currency:
 *                 type: string
 *                 description: Updated currency for the product price
 *                 example: "EUR"
 *               isActive:
 *                 type: boolean
 *                 description: Updated active status of the product
 *                 example: false
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request - Invalid input data or product ID not found
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 *       404:
 *         description: Not found - Product with specified ID does not exist
 */
router.put('/updateproduct', protectAdmin, authorize('admin'), adminController.updateProduct);

/**
 * @swagger
 * /admin/fetchProduct:
 *   get:
 *     summary: Fetch all products
 *     description: Retrieve a list of all products in the system.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   currency:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - User does not have permission.
 */
router.get('/fetchProduct', protectAdmin, authorize('admin'), adminController.fetchProduct);

export default router;
