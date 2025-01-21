import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';``

const Transactions = sequelize.define('Transactions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('deposit', 'airtime_conversion', 'bill_payment', 'debit'),
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'successful', 'failed'),
    defaultValue: 'pending',
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

export default Transactions;

