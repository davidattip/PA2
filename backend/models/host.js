const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');  // Ajustez le chemin selon votre structure de répertoires

const Host = sequelize.define('Host', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,

    user_type: {
        type: DataTypes.STRING,
        defaultValue: 'host'
    },
    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    paranoid: true,
    timestamps: true
});

module.exports = Host;
