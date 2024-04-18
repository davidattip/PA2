const { Sequelize } = require('sequelize');

// Mes informations de connexion MySQL
const sequelize = new Sequelize('pcs_db', 'root', 'pcs_beauprojet', {
    host: '127.0.0.1',
    dialect: 'mysql' // Je m'assure que le dialecte est défini sur 'mysql'
});

module.exports = sequelize;
