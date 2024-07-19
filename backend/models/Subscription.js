// models/Subscription.js

const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const SubscriptionType = require('./SubscriptionType');
const Property = require('./property');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subscriptionTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubscriptionType,
            key: 'id'
        },
        allowNull: false
    },
    propertyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Property,
            key: 'id'
        },
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

Subscription.belongsTo(SubscriptionType, { foreignKey: 'subscriptionTypeId' });
Subscription.belongsTo(Property, { foreignKey: 'propertyId' });

module.exports = Subscription;
