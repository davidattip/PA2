const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploadMiddleware');
const Property = require('../models/property');

const router = express.Router();

router.post('/properties', authenticateJWT, upload.array('photos', 10), async (req, res) => {
  const { title, description, location, price_per_night } = req.body;
  const photos = req.files.map(file => file.path).join(','); // Stocke les chemins des fichiers sous forme de chaîne de caractères

  try {
    const property = await Property.create({
      title,
      description,
      location,
      price_per_night: parseFloat(price_per_night),
      photos,
      host_id: req.user.userId,
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du logement.' });
  }
});

// Endpoint pour récupérer les propriétés du host
router.get('/properties', authenticateJWT, async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: {
        host_id: req.user.userId
      }
    });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logements.' });
  }
});

module.exports = router;
