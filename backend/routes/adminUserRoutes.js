const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../models/user');
const Property = require('../models/property');
const Booking = require('../models/booking');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Route pour afficher la liste des utilisateurs avec pagination et recherche
router.get('/backoffice/users', authenticateJWT, isAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const users = await User.findAndCountAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'user_type', 'banned'],
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(users.count / limit);

    res.json({
      users: users.rows,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir les détails d'un utilisateur par ID
router.get('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      attributes: ['id', 'email', 'first_name', 'last_name', 'user_type', 'banned'],
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir les réservations d'un utilisateur par ID
router.get('/backoffice/users/:id/bookings', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const bookings = await Booking.findAll({
      where: { user_id: userId },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir les propriétés d'un utilisateur par ID
router.get('/backoffice/users/:id/properties', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const properties = await Property.findAll({
      where: { user_id: userId },
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour modifier les informations d'un utilisateur par ID
router.put('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, password } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (password) user.password_hash = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès.',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        banned: user.banned,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour supprimer un utilisateur par ID
router.delete('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    await user.destroy();

    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour bannir un utilisateur par ID
router.patch('/backoffice/users/:id/ban', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.banned = true;
    await user.save();

    res.status(200).json({ message: 'Utilisateur banni avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour débannir un utilisateur par ID
router.patch('/backoffice/users/:id/unban', authenticateJWT, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.banned = false;
    await user.save();

    res.status(200).json({ message: 'Utilisateur débanni avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
