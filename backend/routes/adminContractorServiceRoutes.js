const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const ServiceType = require('../models/ServiceType');
const Contractor = require('../models/contractor');

const router = express.Router();

// Route pour récupérer tous les contractors
router.get('/contractors', authenticateJWT, async (req, res) => {
  try {
    const contractors = await Contractor.findAll();
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des contractors.' });
  }
});

// Route pour attribuer un service à un contractor
router.post('/assign-service', authenticateJWT, async (req, res) => {
  const { serviceTypeId, contractorId } = req.body;

  try {
    const serviceType = await ServiceType.findByPk(serviceTypeId);
    if (!serviceType) {
      return res.status(404).json({ message: 'Type de service non trouvé.' });
    }

    const contractor = await Contractor.findByPk(contractorId);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor non trouvé.' });
    }

    serviceType.chosen_contractor = contractorId;
    await serviceType.save();

    res.status(200).json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'attribution du service.' });
  }
});

module.exports = router;
