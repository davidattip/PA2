const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Contractor = sequelize.define('Contractor', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true // Validation pour s'assurer que l'entrée est un email valide
        }
    },
    user_type: DataTypes.STRING, // 'contractor' par défaut
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    contact_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    contact_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [14, 14] // 14 chiffres pour un SIRET en France
        }
    },
    address: DataTypes.STRING,
    serviceTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ServiceTypes', // Nom du modèle référencé, doit correspondre exactement
            key: 'id' // Clé dans le modèle ServiceType
        }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Contractor;
