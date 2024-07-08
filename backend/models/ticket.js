// models/ticket.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Ticket = sequelize.define('Ticket', {
    person: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM('Faible', 'Moyen', 'Élevé'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Ouvert', 'En cours', 'Résolu', 'Fermé'),
        defaultValue: 'Ouvert',
        allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = Ticket;
