const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Service = sequelize.define('Service', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    tarif: DataTypes.DECIMAL,
    contractor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contractors',  // Assurez-vous que ceci corresponde au nom de table défini dans Sequelize pour les contractants
            key: 'id'
        }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Service;
