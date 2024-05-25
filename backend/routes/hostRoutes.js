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

// Inscription
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const host = await Host.create({ email, password_hash: hashedPassword, first_name, last_name });
        const token = generateToken(host); // Générer un token JWT
        res.status(201).json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const host = await Host.findOne({ where: { email } });
        if (!host || !await bcrypt.compare(password, host.password_hash)) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }
        const token = generateToken(host); // Générer un token JWT
        res.status(200).json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Récupérer les infos du bailleur connecté
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

// Simulation de devis
router.post('/simulation', authenticateJWT, async (req, res) => {
    const { conciergeService, propertyAddress, propertyCountry, propertyType, rentalType, numBedrooms, guestCapacity, surfaceArea } = req.body;
    try {
        // Logique de simulation de devis ici
        const estimatedPrice = calculateEstimatedPrice(conciergeService, propertyAddress, propertyCountry, propertyType, rentalType, numBedrooms, guestCapacity, surfaceArea);
        res.status(200).json({ estimatedPrice });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la simulation de devis.' });
    }
});

const calculateEstimatedPrice = (conciergeService, propertyAddress, propertyCountry, propertyType, rentalType, numBedrooms, guestCapacity, surfaceArea) => {
    // Exemple de logique de calcul de devis basé sur les paramètres fournis
    let basePrice = 50; // Prix de base en euros
    if (conciergeService === 'Gestion de A à Z') basePrice += 100;
    if (conciergeService === 'Web Management') basePrice += 80;

    basePrice += numBedrooms * 20;
    basePrice += guestCapacity * 15;
    basePrice += parseFloat(surfaceArea) * 10;

    // Exemple simple de calcul basé sur le type de propriété
    if (propertyType === 'Maison') basePrice += 150;
    if (rentalType === 'Logement complet') basePrice += 50;

    // Ajustement du prix basé sur le pays
    if (propertyCountry === 'France') basePrice *= 1.2;
    if (propertyCountry === 'Belgique') basePrice *= 1.1;

    return basePrice.toFixed(2); // Retourne le prix estimé avec 2 décimales
};

module.exports = router;
