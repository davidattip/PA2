const express = require('express');
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// S'assurer que la requête est d'abord passée par authenticateJWT puis par isAdmin
router.get('/backoffice/users', authenticateJWT, isAdmin, async (req, res) => {

    // ajouter des paramètres de requête pour la page et la limite, avec des valeurs par défaut si elles ne sont pas fournies
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // On ne renvoit pas tous les utilisateurs, on pagine les résultats
        const users = await User.findAndCountAll({
            attributes: ['id', 'email', 'first_name', 'last_name', 'user_type'],
            limit: limit,
            offset: offset
           // where: {
                // On peut ajouter des conditions ici si nécessaire
            //}
        });

        const totalPages = Math.ceil(users.count / limit);

        // J'envoie la réponse avec les utilisateurs
        res.json({
            users: users.rows,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur interne du serveur." });
    }
});

module.exports = router;
