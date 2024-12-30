// models/BankRecord.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Sequelize instance

const BankRecord = sequelize.define('BankRecord', {
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Transactions', // Assuming your Transactions table is named "Transactions"
      key: 'id',
    },
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
