// models/PropertyDocument.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const PropertyDocument = sequelize.define('PropertyDocument', {
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    document_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        type: DataTypes.DATE,
    },
}, {
    paranoid: true,
    timestamps: true,
});

module.exports = PropertyDocument;
