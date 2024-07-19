const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const ServiceType = sequelize.define('ServiceType', {
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
<<<<<<< Updated upstream
    targetUser: {
        type: DataTypes.ENUM('renter', 'host'),
        allowNull: false
=======
    chosen_contractor: {
        type: DataTypes.INTEGER,
        autoIncrement: true
>>>>>>> Stashed changes
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

module.exports = ServiceType;
