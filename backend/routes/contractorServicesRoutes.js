const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');const ServiceType = require('../models/serviceType'); // Assurez-vous que le chemin est correct
const { isContractor } = require('../middleware/roleMiddleware');
const router = express.Router();

// Route pour lister tous les ServiceTypes
router.get('/service-types', authenticateJWT, isContractor, async (req, res) => {
    try {
        const serviceTypes = await ServiceType.findAll();
        res.json(serviceTypes);
    } catch (error) {
        console.error('Error fetching service types:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route pour sélectionner un ServiceType par un contractor
router.post('/service-types/select/:id', authenticateJWT, isContractor, async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user.userId; // Assurez-vous que le middleware JWT définit bien req.user.userId

    try {
        const serviceType = await ServiceType.findByPk(id);
        if (serviceType) {
            serviceType.chosen_contractor = contractorId;
            await serviceType.save();
            res.status(200).send({ message: 'Service type selected successfully' });
        } else {
            res.status(404).send({ message: 'Service type not found' });
        }
    } catch (error) {
        console.error('Error selecting service type:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
