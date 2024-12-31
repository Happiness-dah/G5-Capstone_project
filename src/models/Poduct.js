// models/Product.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';  // Assuming you have a configured sequelize instance

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  finalPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Products',  // Specify table name (optional if it matches the model name)
  timestamps: true,       // Enables Sequelize to automatically handle createdAt and updatedAt
});

export default Product;
