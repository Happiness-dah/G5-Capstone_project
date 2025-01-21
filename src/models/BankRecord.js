// models/BankRecord.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Sequelize instance
import Transactions from './Transactions.js';

const BankRecord = sequelize.define('BankRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reference_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});
BankRecord.belongsTo(Transactions, {
  foreignKey: 'reference_id',
  targetKey: 'reference_id', // Match the reference_id field in Transactions
  onDelete: 'CASCADE', // Cascade delete to clean up related records
  onUpdate: 'CASCADE',
});

export default BankRecord;
