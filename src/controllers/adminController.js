// adminController.js

import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Pricing from '../models/Pricing.js';
import PaymentService from '../services/paymentService.js';
import NotificationService from '../services/notificationService.js';
import ReportService from '../services/reportService.js';
import PlatformSettings from '../models/PlatformSettings.js';
import AuditLog from '../models/AuditLog.js';
import * as history from '../controllers/transactionController.js'

// Monitor Users
export const monitorUsers = async (req, res) => {
    try {
        const users = await User.find(); // Get all users from the database
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Manage Account Status (Suspend/Reactivate)
export const manageAccountStatus = async (req, res) => {
    try {
        const { userId, action } = req.body; // action: 'suspend' or 'reactivate'
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        user.status = action === 'suspend' ? 'suspended' : 'active';
        await user.save();

        res.status(200).json({ success: true, message: `User ${action}ed successfully.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve Pending Transaction
export const approveTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
        if (transaction.status !== 'pending') return res.status(400).json({ success: false, message: 'Transaction cannot be approved.' });

        transaction.status = 'approved';
        await transaction.save();

        res.status(200).json({ success: true, message: 'Transaction approved successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Refund Transaction
export const refundTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
        if (transaction.status !== 'failed') return res.status(400).json({ success: false, message: 'Refund not applicable for this transaction.' });

        // Refund logic here (e.g., reverse the transaction, refund to user)
        transaction.status = 'refunded';
        await transaction.save();

        res.status(200).json({ success: true, message: 'Transaction refunded successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Pricing Rules
export const updatePricingRules = async (req, res) => {
    try {
        const { serviceType, pricingRules } = req.body; // Example: { "airtime": { "fee": 1.5 } }
        const updatedRules = await Pricing.updateOne({ serviceType }, { $set: pricingRules }, { upsert: true });

        res.status(200).json({ success: true, message: 'Pricing rules updated successfully.', data: updatedRules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reconcile Payments (Check platform and bank records)
export const reconcilePayments = async (req, res) => {
    try {
        const reconciledData = await PaymentService.reconcile();
        res.json({ success: true, data: reconciledData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// View Audit Logs
export const viewAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find(); // Fetch audit logs
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Notifications to Users
export const sendNotifications = async (req, res) => {
    try {
        const { message, recipients } = req.body; // recipients: ['user1', 'user2']
        await NotificationService.send(message, recipients);

        res.status(200).json({ success: true, message: 'Notifications sent successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate Reports (e.g., transactions, user activity)
export const generateReport = async (req, res) => {
    try {
        const { reportType, dateRange } = req.body;
        const reportData = await ReportService.generate(reportType, dateRange);
        res.json({ success: true, data: reportData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Platform Settings (e.g., currency, payment gateway configurations)
export const updatePlatformSettings = async (req, res) => {
    try {
        const { key, value } = req.body; // Example: { key: "currency", value: "USD" }
        const settings = await PlatformSettings.updateOne({ key }, { value }, { upsert: true });

        res.status(200).json({ success: true, message: 'Platform settings updated successfully.', data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const sendNotification = async (req, res) => {
    try {
        const { message, recipients } = req.body;
        const result = await NotificationService.send(message, recipients);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


