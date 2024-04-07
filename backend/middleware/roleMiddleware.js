const authenticateToken = require('./authenticateToken');

function isAdmin(req, res, next) {
    // Votre logique pour vérifier si l'utilisateur est un admin
}

function isRenter(req, res, next) {
    // Votre logique pour vérifier si l'utilisateur est un rentier
}

module.exports = { isAdmin, isRenter };