const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const SubscriptionType = require('../models/SubscriptionType');

const router = express.Router();

// Route pour créer un nouveau type d'abonnement
router.post('/subscription-types', authenticateJWT, async (req, res) => {
  const { name, description, price, targetUser } = req.body;

  try {
    const subscriptionType = await SubscriptionType.create({
      name,
      description,
      price: parseFloat(price),
      targetUser
    });
    res.status(201).json(subscriptionType);
  } catch (error) {
    console.error('Erreur lors de la création du type d\'abonnement:', error);
    res.status(500).json({ message: 'Erreur lors de la création du type d\'abonnement.' });
  }
});

// Route pour récupérer tous les types d'abonnements
router.get('/subscription-types', authenticateJWT, async (req, res) => {
  try {
    const subscriptionTypes = await SubscriptionType.findAll();
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'abonnements:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types d\'abonnements.' });
  }
});

// Route pour récupérer un type d'abonnement par ID
router.get('/subscription-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionType = await SubscriptionType.findOne({ where: { id } });
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Type d\'abonnement non trouvé.' });
    }
    res.status(200).json(subscriptionType);
  } catch (error) {
    console.error('Erreur lors de la récupération du type d\'abonnement:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du type d\'abonnement.' });
  }
});

// Route pour mettre à jour un type d'abonnement par ID
router.put('/subscription-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, targetUser } = req.body;

  try {
    const subscriptionType = await SubscriptionType.findOne({ where: { id } });
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Type d\'abonnement non trouvé.' });
    }

    subscriptionType.name = name;
    subscriptionType.description = description;
    subscriptionType.price = parseFloat(price);
    subscriptionType.targetUser = targetUser;

    await subscriptionType.save();
    res.status(200).json(subscriptionType);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du type d\'abonnement:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du type d\'abonnement.' });
  }
});

// Route pour supprimer un type d'abonnement par ID
router.delete('/subscription-types/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionType = await SubscriptionType.findOne({ where: { id } });
    if (!subscriptionType) {
      return res.status(404).json({ message: 'Type d\'abonnement non trouvé.' });
    }

    await subscriptionType.destroy();
    res.status(200).json({ message: 'Type d\'abonnement supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du type d\'abonnement:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du type d\'abonnement.' });
  }
});

module.exports = router;
