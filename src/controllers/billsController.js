import Bill from '../models/Bill.js';

//  bill payment
export const payBill = async (req, res) => {
    const { userId, billType, amount } = req.body;

    try {
        if (!userId || !billType || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Saving bill payment to the database
        const bill = new Bill({ userId, billType, amount });
        await bill.save();

        res.status(201).json({ message: 'Bill payment successful', bill });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// payment history
export const getPaymentHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const history = await Bill.find({ userId });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
