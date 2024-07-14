const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contractor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contractors', // This needs to match the table name if case sensitive
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    remunPrest: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Service;
