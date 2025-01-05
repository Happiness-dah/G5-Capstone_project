import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    billType: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model('Bill', billSchema);
