const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Contractor = sequelize.define('Contractor', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: DataTypes.STRING,  // Assurez-vous que ce champ est nécessaire et correctement sécurisé
    contact_first_name: DataTypes.STRING,
    contact_last_name: DataTypes.STRING,
    siret: DataTypes.STRING,
    company_name: DataTypes.STRING,
    address: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Contractor;
