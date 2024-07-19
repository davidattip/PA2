const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const SubscriptionType = sequelize.define('SubscriptionType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    targetUser: {
        type: DataTypes.ENUM('renter', 'host'),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = SubscriptionType;
