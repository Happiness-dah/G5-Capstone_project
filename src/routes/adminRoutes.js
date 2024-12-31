import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protectAdmin, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protectAdmin);



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
router.get('/users', protectAdmin,  adminController.monitorUsers);

/**
 * @swagger
 * /admin/account-status:
 *   post:
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
router.post('/account-status', protectAdmin,  adminController.manageAccountStatus);

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
router.post('/approve-transaction', protectAdmin,  adminController.approveTransaction);

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
router.post('/refund', protectAdmin,  adminController.refundTransaction);

/**
 * @swagger
 * /admin/pricing-rules:
 *   post:
 *     summary: Update pricing rules
 *     description: Update the rules for pricing on services such as airtime, data, etc.
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
 *               pricingRules:
 *                 type: object
 *                 description: New pricing rules for services
 *                 example: { "airtime": 1.50, "data": 0.80 }
 *     responses:
 *       200:
 *         description: Pricing rules updated successfully
 *       400:
 *         description: Bad request - Invalid pricing rules data
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/pricing-rules', protectAdmin,adminController.updatePricingRules);

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
router.get('/reconcile-payments', protectAdmin, adminController.reconcilePayments);

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
router.get('/audit-logs', protectAdmin, adminController.viewAuditLogs);

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
router.post('/notifications', protectAdmin,  adminController.sendNotifications);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Generate financial reports
 *     description: Generate financial reports for the platform.
 *      tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/reports', protectAdmin,  adminController.generateReport);

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
router.post('/platform-settings', protectAdmin, adminController.updatePlatformSettings);

export default router;
