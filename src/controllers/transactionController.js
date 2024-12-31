import Transaction from '../models/Transaction.js'; // Transaction model
import User from '../models/User.js'; // User model (if needed for validations)

// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const { userId, amount, type, description, status } = req.body;

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Create the transaction
        const transaction = new Transaction({
            userId,
            amount,
            type, // e.g., 'airtime', 'data', 'transfer'
            description,
            status: status || 'pending', // Default to 'pending' if not provided
        });

        const savedTransaction = await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully.',
            data: savedTransaction,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get transactions (by user or all)
export const getTransactions = async (req, res) => {
    try {
        const { userId } = req.query;

        // Fetch transactions for a specific user or all transactions
        const filter = userId ? { userId } : {};
        const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Transactions retrieved successfully.',
            data: transactions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Delete a transaction (optional)
export const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        if (!deletedTransaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully.',
            data: deletedTransaction,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
