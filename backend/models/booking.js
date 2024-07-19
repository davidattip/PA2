// models/Booking.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Booking = sequelize.define('Booking', {
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Properties',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Booking;
