const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    user_type: DataTypes.STRING, // 'admin' ou 'renter'
    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email_verification_token: DataTypes.STRING,
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = User;
