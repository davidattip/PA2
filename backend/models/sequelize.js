require('dotenv').config();
const { Sequelize } = require('sequelize');

// Utilisation des variables d'environnement pour la configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nom de la base de données
    process.env.DB_USER,     // Utilisateur
    process.env.DB_PASS,     // Mot de passe
    {
        host: process.env.DB_HOST, // Hôte
        port: process.env.DB_PORT, // Port ajouté ici
        dialect: 'mysql'          // Dialecte
    }
);
module.exports = sequelize;
