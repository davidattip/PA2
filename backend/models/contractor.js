const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Contractor = sequelize.define('Contractor', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validation pour s'assurer que l'entrée est un email valide
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false, // Assurez-vous que le mot de passe est toujours fourni
        validate: {
            notEmpty: true, // Assurez-vous que le champ n'est pas vide
        }
    },
    contact_first_name: {
        type: DataTypes.STRING,
        allowNull: false, // Validation pour nécessiter un prénom
        validate: {
            notEmpty: true // Assure que le champ n'est pas vide
        }
    },
    contact_last_name: {
        type: DataTypes.STRING,
        allowNull: false, // Validation pour nécessiter un nom
        validate: {
            notEmpty: true // Assure que le champ n'est pas vide
        }
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false, // Le nom de l'entreprise doit être présent
        validate: {
            notEmpty: true // Assure que le champ n'est pas vide
        }
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: false, // Le numéro SIRET doit être présent
        validate: {
            notEmpty: true, // Assure que le champ n'est pas vide
            len: [14, 14] // Validation de la longueur du numéro SIRET (14 chiffres en France)
        }
    },
    address: DataTypes.STRING, // Pas de validation spécifique pour l'adresse
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true, // Utilisation de 'deletedAt' pour les suppressions logiques
    timestamps: true // Gère automatiquement les champs 'createdAt' et 'updatedAt'
});

module.exports = Contractor;
