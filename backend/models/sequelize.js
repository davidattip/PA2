const { Sequelize } = require('sequelize');

// Remplacez les valeurs ci-dessous par vos informations de connexion MySQL
const sequelize = new Sequelize('pcs_db', 'root', 'pcs_beauprojet', {
    host: '127.0.0.1',
    dialect: 'mysql' // Assurez-vous que le dialecte est défini sur 'mysql'
});

module.exports = sequelize;
