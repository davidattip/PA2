const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/authenticateToken');
const Contractor = require('../models/contractor');
const { isContractor } = require('../middleware/roleMiddleware');
const generateContractorToken = require('../utils/generateContractorToken');

const router = express.Router();

if (Contractor) {
    // Inscription
    router.post('/register', async (req, res) => {
        const { email, password, contact_first_name, contact_last_name, siret, company_name, address } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const contractor = await Contractor.create({
                email,
                password_hash: hashedPassword,
                contact_first_name,
                contact_last_name,
                siret,
                company_name,
                address,
                user_type: 'contractor'
            });
            const token = generateContractorToken(contractor); // Générer un token JWT
            res.status(201).json({ accessToken: token });
        } catch (error) {
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    });

    // Connexion
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const contractor = await Contractor.findOne({ where: { email } });
            if (!contractor || !await bcrypt.compare(password, contractor.password_hash)) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }
            const token = generateContractorToken(contractor);
            res.status(200).json({ accessToken: token, user_type: contractor.user_type });
        } catch (error) {
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    });

    // Récupérer les infos du prestataire connecté
    router.get('/me', authenticateJWT, isContractor, async (req, res) => {
        if (req.user.user_type !== 'contractor') {
            return res.sendStatus(403);
        }
        try {
            const contractor = await Contractor.findByPk(req.user.userId, {
                attributes: ['id', 'email', 'contact_first_name', 'contact_last_name', 'siret', 'company_name', 'address']
            });
            res.json(contractor);
        } catch (error) {
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    });

    router.post('/setCompany', authenticateJWT, isContractor, async (req, res) => {
        const { company_siret } = req.body;
        try {
            const contractor = await Contractor.findByPk(req.user.userId);
            if (!contractor) {
                return res.status(404).json({ message: 'Contractor not found.' });
            }
            contractor.siret = company_siret;
            await contractor.save();
            res.status(200).json({ message: 'Company set successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    });
} else {
    console.warn('Contractor module is not available. Skipping contractor routes.');
}

module.exports = router;
