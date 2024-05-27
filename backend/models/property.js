// models/property.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Property = sequelize.define('Property', {
    host_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    price_per_night: DataTypes.DECIMAL,
    subscribed: DataTypes.BOOLEAN,
    photos: DataTypes.TEXT, // Changez le type à TEXT pour stocker les chemins des fichiers sous forme de chaîne de caractères
    image_validated: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Property;
