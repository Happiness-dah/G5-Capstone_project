import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Transactions from './Transactions.js';

const AirtimeConversion = sequelize.define('AirtimeConversion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  telecom_provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
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
AirtimeConversion.belongsTo(Transactions, {
  foreignKey: 'reference_id',
  targetKey: 'reference_id', // Match the reference_id field in Transactions
  onDelete: 'CASCADE', // Cascade delete to clean up related records
  onUpdate: 'CASCADE',
});
export default AirtimeConversion;
