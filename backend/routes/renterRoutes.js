const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isRenter } = require('../middleware/roleMiddleware');
const db = require('../models/sequelize');  // Chemin corrigé pour pointer vers le modèle Sequelize
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous que le modèle User est correctement défini

const router = express.Router();

router.get('/profile', authenticateJWT, isRenter, async (req, res) => {
    if (!req.user) {
        return res.status(404).send("Profil non trouvé.");
    }
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'first_name', 'last_name']
        });
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        res.json(user);
    } catch (error) {
        res.status(500).send("Erreur interne du serveur.");
    }
});

router.put('/profile', authenticateJWT, isRenter, async (req, res) => {
    const { firstName, lastName } = req.body;
    const userId = req.user.userId;

    try {
        await User.update({ first_name: firstName, last_name: lastName }, {
            where: { id: userId }
        });
        res.status(200).send('Profil mis à jour avec succès.');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Erreur lors de la mise à jour du profil.');
    }
});

router.post('/initiate-email-change', authenticateJWT, isRenter, async (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user.userId;

    try {
        const token = jwt.sign({ userId, newEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const verificationLink = `${process.env.FRONTEND_URL}/renter/verify-email?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newEmail,
            subject: 'Vérification de votre nouvelle adresse email',
            text: `Cliquez sur ce lien pour vérifier votre nouvelle adresse email: ${verificationLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Email de vérification envoyé.');
    } catch (error) {
        console.error('Error initiating email change:', error);
        res.status(500).send('Erreur lors de l\'initiation du changement d\'email.');
    }
});

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { userId, newEmail } = decoded;

        await User.update({ email: newEmail }, {
            where: { id: userId }
        });
        res.status(200).send('Email mis à jour avec succès.');
    } catch (error) {
        console.error('Error verifying email change:', error);
        res.status(500).send('Erreur lors de la vérification du changement d\'email.');
    }
});

module.exports = router;
