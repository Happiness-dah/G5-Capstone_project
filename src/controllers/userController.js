import User from "../models/User.js";
import Bank from "../models/Bank.js";
import Product from "../models/Product.js";

export const fetchAccountBalnce = async (req, res) => {
    const { userId } = req.body
    if (userId) {
        try {
            const balance = await User.findOne({
                where: { id: userId },
                attributes : ['account_balance']
            });
            
            res.status(200).json({ success: true, data: balance });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    } else {
        res.status(401).json({
            success: false,
            message: "User id is needed"
        })
    }
}


export const FecthallBank = async (req, res) => {
    try {
        const banks = await Bank.findAll();
        res.status(200).json({ success: true, data: banks })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const fetchUserDetail = async (req, res) => {
    const { userId } = req.body
    if (userId) {
        try {
            const user = await User.findByPk({
                where: { id: userId }
            });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })

        }
    } else {
        res.status(401).json({
            success: false,
            message: "User id is needed"
        })
    }

}


export const fetchProduct = async (req, res) => {
    try {
        const product = await Product.findAll({}); // Get all products from the database
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
