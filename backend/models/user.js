//  /models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Mise à jour du chemin pour le fichier sequelize.js dans le même dossier

const User = sequelize.define('User', {
    // Attributs de modèle ici
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
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
    timestamps: true, // Ajoute les champs `createdAt` et `updatedAt` automatiquement
    paranoid: true,  // Ajoute le champ `deletedAt` et n'efface pas réellement les données de la DB

});
// Synchronisation du modèle avec la base de données de fait dans initDb.js

module.exports = User;
