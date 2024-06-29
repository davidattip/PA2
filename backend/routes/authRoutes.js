const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authenticateToken');

const router = express.Router();

const generateUserToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, user_type: user.user_type },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_type = 'renter';
        const user = await User.create({
            email,
            password_hash: hashedPassword,
            first_name,
            last_name,
            user_type
        });
        res.status(201).send({ message: "User created successfully", userId: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            // Vérifiez si l'utilisateur est banni
            if (user.banned) {
                return res.status(403).json({ message: 'Votre compte a été banni.' });
            }

            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (validPassword) {
                const token = generateUserToken(user);
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

router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'first_name', 'last_name', 'user_type']
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
