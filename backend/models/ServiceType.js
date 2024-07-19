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
    targetUser: {
        type: DataTypes.ENUM('renter', 'host'),
        allowNull: false
    },
    chosen_contractor: {
        type: DataTypes.INTEGER,
        allowNull: true // Correction ici : 'autoIncrement' a été enlevé, car il n'est généralement pas utilisé sur des champs autres que la clé primaire.
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
    timestamps: true // Cette option doit être dans un objet de configuration séparé, pas directement dans le modèle.
});

module.exports = ServiceType;
