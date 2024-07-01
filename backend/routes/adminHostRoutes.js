const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Host = require('../models/host');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Route pour afficher la liste des hôtes avec pagination et recherche
router.get('/backoffice/hosts', authenticateJWT, isAdmin, async (req, res) => {
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

    const hosts = await Host.findAndCountAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'banned'],
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(hosts.count / limit);

    res.json({
      hosts: hosts.rows,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour obtenir les détails d'un hôte par ID
router.get('/backoffice/hosts/:id', authenticateJWT, isAdmin, async (req, res) => {
  const hostId = req.params.id;

  try {
    const host = await Host.findOne({
      attributes: ['id', 'email', 'first_name', 'last_name', 'banned'],
      where: { id: hostId },
    });

    if (!host) {
      return res.status(404).json({ message: 'Hôte non trouvé.' });
    }

    res.status(200).json(host);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour modifier les informations d'un hôte par ID
router.put('/backoffice/hosts/:id', authenticateJWT, isAdmin, async (req, res) => {
  const hostId = req.params.id;
  const { first_name, last_name, email, password } = req.body;

  try {
    const host = await Host.findOne({ where: { id: hostId } });

    if (!host) {
      return res.status(404).json({ message: 'Hôte non trouvé.' });
    }

    if (first_name) host.first_name = first_name;
    if (last_name) host.last_name = last_name;
    if (email) host.email = email;
    if (password) host.password_hash = await bcrypt.hash(password, 10);

    await host.save();

    res.status(200).json({
      message: 'Hôte mis à jour avec succès.',
      host: {
        id: host.id,
        first_name: host.first_name,
        last_name: host.last_name,
        email: host.email,
        banned: host.banned,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour supprimer un hôte par ID
router.delete('/backoffice/hosts/:id', authenticateJWT, isAdmin, async (req, res) => {
  const hostId = req.params.id;

  try {
    const host = await Host.findOne({ where: { id: hostId } });

    if (!host) {
      return res.status(404).json({ message: 'Hôte non trouvé.' });
    }

    await host.destroy();

    res.status(200).json({ message: 'Hôte supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour bannir un hôte par ID
router.patch('/backoffice/hosts/:id/ban', authenticateJWT, isAdmin, async (req, res) => {
  const hostId = req.params.id;

  try {
    const host = await Host.findOne({ where: { id: hostId } });

    if (!host) {
      return res.status(404).json({ message: 'Hôte non trouvé.' });
    }

    host.banned = true;
    await host.save();

    res.status(200).json({ message: 'Hôte banni avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Route pour débannir un hôte par ID
router.patch('/backoffice/hosts/:id/unban', authenticateJWT, isAdmin, async (req, res) => {
  const hostId = req.params.id;

  try {
    const host = await Host.findOne({ where: { id: hostId } });

    if (!host) {
      return res.status(404).json({ message: 'Hôte non trouvé.' });
    }

    host.banned = false;
    await host.save();

    res.status(200).json({ message: 'Hôte débanni avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
