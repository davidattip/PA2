const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/authenticateToken');
const Host = require('../models/host');

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, user_type: user.user_type },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
};

router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const host = await Host.create({ email, password_hash: hashedPassword, first_name, last_name });
        const token = generateToken(host);
        res.status(201).json({ accessToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const host = await Host.findOne({ where: { email } });
        if (!host || !await bcrypt.compare(password, host.password_hash)) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }
        const token = generateToken(host);
        res.status(200).json({ accessToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const host = await Host.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'first_name', 'last_name']
        });
        res.json(host);
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
