// Dans roleMiddleware.js

const authenticateJWT = require('./authenticateToken');

// Middleware pour vérifier si l'utilisateur est admin
function isAdmin(req, res, next) {
    // Vous devriez avoir req.user disponible à ce stade, rempli par authenticateJWT
    if (req.user && req.user.user_type === 'admin') {
        next(); // L'utilisateur est admin, on continue le traitement de la requête
    } else {
        res.status(403).send({ message: "Accès refusé. Vous devez être administrateur." });
    }
}

// Middleware pour vérifier si l'utilisateur est un renter
function isRenter(req, res, next) {
    // Vous devriez avoir req.user disponible à ce stade, rempli par authenticateJWT
    if (req.user && req.user.user_type === 'renter') {
        next(); // L'utilisateur est renter, on continue le traitement de la requête
    } else {
        res.status(403).send({ message: "Accès refusé. Vous devez être renter." });
    }
}

module.exports = { isAdmin, isRenter };
