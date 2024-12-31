// models/BankRecord.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Sequelize instance

const BankRecord = sequelize.define('BankRecord', {
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
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

export default BankRecord;
