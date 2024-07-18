const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

const generateUserToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, user_type: user.user_type },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
};

// Enregistrement de l'utilisateur avec vérification par e-mail
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

        const token = generateUserToken(user);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        await sendEmail(email, 'Vérification de votre compte', `Veuillez vérifier votre compte en cliquant sur le lien suivant: ${verificationUrl}`);

        res.status(201).send({ message: "Utilisateur créé avec succès, veuillez vérifier votre e-mail.", userId: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Connexion de l'utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            // Vérifiez si l'utilisateur est banni
            if (user.banned) {
                return res.status(403).json({ message: 'Votre compte a été banni.' });
            }

            // Vérifiez si l'utilisateur a vérifié son e-mail
            if (!user.email_verified) {
                return res.status(403).json({ message: 'Veuillez vérifier votre e-mail avant de vous connecter.' });
            }

            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (validPassword) {
                const token = generateUserToken(user);
                res.json({ accessToken: token, user_type: user.user_type, first_name: user.first_name });
            } else {
                res.status(400).json({ message: 'Mot de passe incorrect.' });
            }
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur." });
    }
});

module.exports = router;

// Endpoint pour récupérer les informations de l'utilisateur authentifié
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

// Endpoint pour vérifier l'e-mail
router.get('/verify-email', async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

        user.email_verified = true;
        await user.save();

        res.status(200).send("Email vérifié avec succès.");
    } catch (error) {
        console.error("Erreur de vérification de l'e-mail:", error);
        res.status(400).send("Lien de vérification invalide ou expiré.");
    }
});

// Endpoint pour la réinitialisation du mot de passe
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

        const token = generateUserToken(user);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await sendEmail(email, 'Réinitialisation de votre mot de passe', `Réinitialisez votre mot de passe en cliquant sur le lien suivant: ${resetUrl}`);

        res.status(200).send({ message: "E-mail de réinitialisation de mot de passe envoyé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'envoi de l'e-mail de réinitialisation de mot de passe.");
    }
});

// Endpoint pour le changement de mot de passe
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findOne({ where: { id: decoded.userId, email: decoded.email } });

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        res.status(200).send({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la réinitialisation du mot de passe.");
    }
});

module.exports = router;
