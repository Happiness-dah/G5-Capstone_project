// models/PlatformSettings.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Assuming you have a database connection setup

const PlatformSettings = sequelize.define('PlatformSettings', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures each setting key is unique
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // Optional, for providing description of each setting
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Export the PlatformSettings model
export default PlatformSettings;
