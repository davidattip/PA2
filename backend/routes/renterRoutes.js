const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isRenter } = require('../middleware/roleMiddleware');
const router = express.Router();

// Utilisez authenticateJWT pour vérifier l'authenticité du token
// puis isRenter pour confirmer que l'utilisateur est un renter
router.get('/profile', authenticateJWT, isRenter, (req, res) => {
    // Logique du profil rentier
    // Supposons que vous voulez renvoyer des informations de profil de base
    if (!req.user) {
        return res.status(404).send("Profil non trouvé.");
    }
    // Accéder à des données utilisateur plus détaillées peut nécessiter une requête à la DB
    // Ici, nous retournons simplement des informations simplifiées pour l'exemple
    res.json({
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.user_type,
        message: "Profil du rentier accessible."
    });
});

module.exports = router;
