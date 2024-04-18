//  /models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Mise à jour du chemin pour le fichier sequelize.js dans le même dossier

const User = sequelize.define('User', {
    // Attributs de modèle ici
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    user_type: DataTypes.STRING // 'admin' ou 'renter'
}, {
    // options de modèle ici
});

module.exports = User;
