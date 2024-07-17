const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const ServiceType = require('../models/ServiceType');

const router = express.Router();

// Route pour créer un nouveau type de service
router.post('/service-types', authenticateJWT, async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const serviceType = await ServiceType.create({
      name,
      description,
      price: parseFloat(price),
    });
    res.status(201).json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du type de service.' });
  }
});

// Route pour récupérer tous les types de services
router.get('/service-types', authenticateJWT, async (req, res) => {
  try {
    const serviceTypes = await ServiceType.findAll();
    res.status(200).json(serviceTypes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des types de services.' });
  }
});

// Route pour récupérer un type de service par ID
router.get('/service-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const serviceType = await ServiceType.findOne({ where: { id } });
    if (!serviceType) {
      return res.status(404).json({ message: 'Type de service non trouvé.' });
    }
    res.status(200).json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du type de service.' });
  }
});

// Route pour mettre à jour un type de service par ID
router.put('/service-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const serviceType = await ServiceType.findOne({ where: { id } });
    if (!serviceType) {
      return res.status(404).json({ message: 'Type de service non trouvé.' });
    }

    serviceType.name = name;
    serviceType.description = description;
    serviceType.price = parseFloat(price);

    await serviceType.save();
    res.status(200).json(serviceType);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du type de service.' });
  }
});

// Route pour supprimer un type de service par ID
router.delete('/service-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const serviceType = await ServiceType.findOne({ where: { id } });
    if (!serviceType) {
      return res.status(404).json({ message: 'Type de service non trouvé.' });
    }

    await serviceType.destroy();
    res.status(200).json({ message: 'Type de service supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du type de service.' });
  }
});

module.exports = router;
