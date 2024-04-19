// /routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // Définir par défaut tous les nouveaux utilisateurs comme "renter"
        const user_type = 'renter';
        const user = await User.create({
            email,
            password_hash: hashedPassword,
            first_name,
            last_name,
            user_type // Utiliser la valeur fixe "renter"
        });
        // Peut-être omettre le retour de l'objet utilisateur complet pour des raisons de sécurité
        res.status(201).send({ message: "User created successfully", userId: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    // Récupérer email et mot de passe depuis req.body
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur par son email
        const user = await User.findOne({ where: { email } });

        if (user) {
            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (validPassword) {
                // Générer un JWT pour l'utilisateur
                const token = jwt.sign(
                    { userId: user.id, email: user.email,user_type: user.user_type },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '24h' } // Le token expire dans 24 heures
                );
                // On peut même inclure `user_type` dans la réponse pour une gestion front-end immédiate
                res.json({ accessToken: token, user_type: user.user_type });
                console.log(token);
            } else {
                res.status(400).send('Mot de passe incorrect.');
            }
        } else {
            res.status(404).send("Utilisateur non trouvé.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la connexion de l'utilisateur.");
    }
});

module.exports = router;