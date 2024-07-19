const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isContractor } = require('../middleware/roleMiddleware');
const Contractor = require('../models/contractor');
const Service = require('../models/service');
const router = express.Router();

router.get('/me', authenticateJWT, isContractor, async (req, res) => {
    try {
        const contractor = await Contractor.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'contact_first_name', 'contact_last_name', 'siret', 'company_name', 'address']
        });
        if (!contractor) {
            return res.status(404).json({ message: "Contractor not found." });
        }
        res.json(contractor);
    } catch (error) {
        console.error('Error fetching contractor info:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.get('/services', authenticateJWT, isContractor, async (req, res) => {
    const { status } = req.query;  // Assurez-vous que ce champ est utilisé correctement.
    try {
        const whereClause = {
            contractor_id: req.user.userId
        };
        if (status) {  // Assurez-vous que le champ `status` est défini dans le modèle.
            whereClause.status = status;
        }
        const services = await Service.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'price', 'remunPrest', 'description', 'createdAt']
        });
        res.json(services);
    } catch (error) {
        console.error(`Error fetching services:`, error);
        res.status(500).json({ message: 'Internal server error while fetching services.' });
    }
});


module.exports = router;
