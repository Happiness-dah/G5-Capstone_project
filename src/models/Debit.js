import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Transactions from './Transactions.js';
import User from './User.js';
const Debit = sequelize.define('Debit', {
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
  recipient: {
    type: DataTypes.STRING, // E.g., recipient account or phone number
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'successful', 'failed'),
    defaultValue: 'pending',
  },
  remarks: {
    type: DataTypes.STRING, // Optional remarks or notes
    allowNull: true,
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
Debit.belongsTo(Transactions, { foreignKey: 'reference_id' })
Debit.belongsTo(User, { foreignKey: 'user_id' })

export default Debit;
