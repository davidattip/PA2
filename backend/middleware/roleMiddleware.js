const authenticateJWT = require('./authenticateToken');

// Middleware pour vérifier si l'utilisateur est admin
function isAdmin(req, res, next) {
    // On récupère req.user, qui contient les infos du token, remplis par authenticateJWT
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

// Middleware pour vérifier si l'utilisateur est un contractor
function isContractor(req, res, next) {
    if (req.user && req.user.user_type === 'contractor') {
        next(); // L'utilisateur est contractor, on continue le traitement de la requête
    } else {
        res.status(403).send({ message: "Accès refusé. Vous devez être contractor." });
    }
}

// Middleware pour vérifier si l'utilisateur est un host
function isHost(req, res, next) {
    if (req.user && req.user.user_type === 'host') {
        next(); // L'utilisateur est host, on continue le traitement de la requête
    } else {
        res.status(403).send({ message: "Accès refusé. Vous devez être host." });
    }
}

module.exports = { isAdmin, isRenter, isContractor, isHost };
