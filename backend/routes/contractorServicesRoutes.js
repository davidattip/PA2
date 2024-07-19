const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');const ServiceType = require('../models/serviceType'); // Assurez-vous que le chemin est correct
const { isContractor } = require('../middleware/roleMiddleware');

const Contractor = require('../models/contractor');
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

// Route e but est de rajouter au contractor connecté, dans la colonne serviceTypeId, l'id su ServiceType qu'il a choisit.
router.post('/service-types/select/:id', authenticateJWT, isContractor, async (req, res) => {
    const { id } = req.params;
    const contractorId = req.user.userId; // Assurez-vous que le middleware JWT définit bien req.user.userId

    try {
        // Trouver le contractor actuel
        const contractor = await Contractor.findByPk(contractorId);
        if (!contractor) {
            return res.status(404).send({ message: 'Contractor not found' });
        }

        // Vérifier si le ServiceType existe
        const serviceType = await ServiceType.findByPk(id);
        if (!serviceType) {
            return res.status(404).send({ message: 'Service type not found' });
        }

        // Mettre à jour le contractor avec le serviceTypeId choisi
        contractor.serviceTypeId = id;
        await contractor.save();

        res.status(200).send({ message: 'Service type selected successfully', selectedServiceTypeId: id });
    } catch (error) {
        console.error('Error selecting service type:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
