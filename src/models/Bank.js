import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; ``
const Bank = sequelize.define('Banks', {
    id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
    },
    bankname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_bankname'
    },
    bankcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'unique_bankcode',
    }
})
export default Bank;