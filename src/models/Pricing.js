import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import Product from './Product.js';

const Pricing = sequelize.define('Pricing', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    product_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,

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
    tableName: 'Pricings',
    timestamps: true,
});
Pricing.belongsTo(Product, { foreignKey: 'product_Id' });
export default Pricing;
