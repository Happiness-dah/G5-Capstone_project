import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Transactions from './Transactions.js';
const BillPayments = sequelize.define('BillPayments', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  bill_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bill_provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'successful', 'failed'),
    defaultValue: 'pending',
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

BillPayments.belongsTo(Transactions, {
  foreignKey: 'reference_id',
  targetKey: 'reference_id', // Match the reference_id field in Transactions
  onDelete: 'CASCADE', // Cascade delete to clean up related records
  onUpdate: 'CASCADE',
});
export default BillPayments;
