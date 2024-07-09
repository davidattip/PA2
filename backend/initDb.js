// initDb.js
// Import de tous les modèles pour garantir leur chargement et l'initialisation des relations
const sequelize = require('./models/sequelize');
require('./models/associations');
const initDb = () => {
    return sequelize.authenticate()  // Retourne une promesse ici
        .then(() => {
            console.log('Connection has been established successfully.');
            return sequelize.sync({ alter: true });  // Assurez-vous de retourner cette promesse également
        })
        .then(() => {
            console.log("All models were synchronized successfully.");
        })
        .catch(err => {
            console.error('Error syncing models:', err);
            throw err;  // Relancer l'erreur pour qu'elle puisse être captée par le .catch() dans app.js
        });
}

module.exports = initDb;
