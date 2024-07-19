// routes/hostSubscriptionRoutes.js

const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const SubscriptionType = require('../models/SubscriptionType');
const Subscription = require('../models/Subscription');
const Property = require('../models/property');

const router = express.Router();

// Route pour récupérer les types d'abonnements disponibles
router.get('/subscription-types', authenticateJWT, async (req, res) => {
  try {
    const subscriptionTypes = await SubscriptionType.findAll({ where: { targetUser: 'host' } });
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des types d\'abonnements.' });
  }
});

// Route pour récupérer les propriétés d'un hôte
router.get('/properties', authenticateJWT, async (req, res) => {
  try {
    const properties = await Property.findAll({ where: { host_id: req.user.userId } });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des propriétés.' });
  }
});

// Route pour récupérer les abonnements d'un hôte
router.get('/subscriptions', authenticateJWT, async (req, res) => {
    try {
      const subscriptions = await Subscription.findAll({
        where: { userId: req.user.userId },
        include: [SubscriptionType, Property]
      });
      console.log('Subscriptions:', JSON.stringify(subscriptions, null, 2)); // Ajouter cette ligne pour vérifier les données
      res.status(200).json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des abonnements.' });
    }
  });
  

// Route pour créer un nouvel abonnement pour un hôte
router.post('/subscriptions', authenticateJWT, async (req, res) => {
  const { startDate, endDate, status, subscriptionTypeId, propertyId } = req.body;

  try {
    const subscription = await Subscription.create({
      startDate,
      endDate,
      status,
      userId: req.user.userId,
      subscriptionTypeId,
      propertyId
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'abonnement.' });
  }
});

// Route pour mettre à jour un abonnement d'un hôte
router.put('/subscriptions/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, status, subscriptionTypeId, propertyId } = req.body;

  try {
    const subscription = await Subscription.findOne({ where: { id, userId: req.user.userId } });
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé.' });
    }

    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.status = status;
    subscription.subscriptionTypeId = subscriptionTypeId;
    subscription.propertyId = propertyId;

    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'abonnement.' });
  }
});

// Route pour supprimer un abonnement d'un hôte
router.delete('/subscriptions/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const subscription = await Subscription.findOne({ where: { id, userId: req.user.userId } });
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé.' });
    }

    await subscription.destroy();
    res.status(200).json({ message: 'Abonnement supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'abonnement.' });
  }
});

module.exports = router;
