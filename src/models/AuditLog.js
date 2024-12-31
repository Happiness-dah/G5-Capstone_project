// models/AuditLog.js

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Assuming you have a database connection setup
import User from './User.js'; // Assuming you have a User model for logging actions by users

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID, // Ensure that the User model uses UUID as well
    allowNull: false,
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: true, // This is for tracking which specific data was affected (optional)
  },
  targetType: {
    type: DataTypes.STRING,
    allowNull: true, // This can specify the type of object being affected (e.g., 'Product', 'Order', etc.)
  },
  details: {
    type: DataTypes.JSON, // Use JSON for MySQL, JSONB for PostgreSQL
    allowNull: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Define relationship between AuditLog and User
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// Export the AuditLog model
export default AuditLog;
