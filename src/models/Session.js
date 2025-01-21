import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';
const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    timeLimit: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
}, {
    timestamps: true,
    tableName: 'sessions',
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (Session.token) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(Session.token, salt);
            }
        }
    }
});

export default Session;
