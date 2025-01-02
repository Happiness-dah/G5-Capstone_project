import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Transactions from './Transactions.js';
import User from './User.js';

const Deposit = sequelize.define('Deposit', {
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
  reference_id: {
    type: DataTypes.UUID,
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
Deposit.belongsTo(Transactions, { foreignKey: 'reference_id' })
Deposit.belongsTo(User, { foreignKey: 'user_id' })


export default Deposit;
