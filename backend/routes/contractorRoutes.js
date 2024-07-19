const express = require('express');
const bcrypt = require('bcrypt');
const Contractor = require('../models/contractor');
const generateContractorToken = require('../utils/generateContractorToken');
const router = express.Router();

// Route pour l'enregistrement d'un nouveau prestataire
router.post('/register', async (req, res) => {
    try {
        const { email, password, contact_first_name, contact_last_name, siret, company_name, address } = req.body;

        // Vérifier si le contratant existe déjà
        const existingContractor = await Contractor.findOne({ where: { email } });
        if (existingContractor) {
            return res.status(409).send({ message: 'Email already in use' });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Création du nouveau Contractor
        const contractor = await Contractor.create({
            email,
            user_type: 'contractor', // Défini par défaut ici
            password_hash,
            contact_first_name,
            contact_last_name,
            siret,
            company_name,
            address
        });

        // Réponse de succès
        res.status(201).send({
            message: 'Contractor registered successfully',
            contractor: {
                email: contractor.email,
                company_name: contractor.company_name,
                contact_first_name: contractor.contact_first_name,
                contact_last_name: contractor.contact_last_name,
                siret: contractor.siret,
                address: contractor.address
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).send({ message: 'Server error during registration' });
    }
});



// Route de connexion pour les contractors
// Login route for contractors
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const contractor = await Contractor.findOne({ where: { email } });
        if (!contractor) {
            return res.status(404).send({ message: 'Contractor not found' });
        }

        const isMatch = await bcrypt.compare(password, contractor.password_hash);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a JWT for the contractor
        const token = generateContractorToken(contractor);

        res.status(200).send({
            message: 'Login successful',
            contractor: {
                id: contractor.id,
                email: contractor.email,
                user_type: contractor.user_type,
                contact_first_name: contractor.contact_first_name,
                contact_last_name: contractor.contact_last_name,
                company_name: contractor.company_name,
                siret: contractor.siret,
                address: contractor.address
            },
            token
        });
    } catch (error) {
        console.error('Error during contractor login:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

module.exports = router;
