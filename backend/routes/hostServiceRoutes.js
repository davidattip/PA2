// routes/hostServiceRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const ServiceType = require('../models/ServiceType');
const Property = require('../models/property');
const Service = require('../models/service');

const router = express.Router();

// Route pour récupérer les types de services disponibles pour les hôtes
router.get('/services', authenticateJWT, async (req, res) => {
  try {
    const services = await ServiceType.findAll({ where: { targetUser: 'host' } });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services.' });
  }
});

// Route pour acheter un service
router.post('/buy-service', authenticateJWT, async (req, res) => {
  const { serviceTypeId, propertyId } = req.body;
  console.log('Received request to buy service:', req.body);

  try {
    const property = await Property.findOne({ where: { id: propertyId, host_id: req.user.userId } });
    if (!property) {
      console.error('Property not found or does not belong to host:', propertyId);
      return res.status(404).json({ message: 'Propriété non trouvée.' });
    }

    const serviceType = await ServiceType.findByPk(serviceTypeId);
    if (!serviceType) {
      console.error('Service type not found:', serviceTypeId);
      return res.status(404).json({ message: 'Type de service non trouvé.' });
    }

    const service = await Service.create({
      contractor_id: null, // Permettre un contractor par défaut null
      name: serviceType.name,
      price: serviceType.price,
      remunPrest: serviceType.price * 0.8, // Exemple de calcul de la rémunération
      description: serviceType.description,
      propertyId: property.id
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error buying service:', error);
    res.status(500).json({ message: 'Erreur lors de l\'achat du service.' });
  }
});

module.exports = router;
