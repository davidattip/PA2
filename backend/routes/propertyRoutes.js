// routes/propertyRoutes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploadMiddleware');
const Property = require('../models/property');
const Availability = require('../models/availability');
const Booking = require('../models/booking'); // Importez le modèle Booking

const router = express.Router();

router.post('/properties', authenticateJWT, upload.array('photos', 4), async (req, res) => { 
  const { title, description, location, price_per_night } = req.body;
  const photos = req.files.map(file => file.path).join(','); 

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

router.get('/public/properties', async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logements.' });
  }
});

router.get('/public/properties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({
      where: {
        id
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée.' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la propriété.' });
  }
});

router.get('/properties/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({
      where: {
        id,
        host_id: req.user.userId
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée.' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la propriété.' });
  }
});

router.put('/properties/:id', authenticateJWT, upload.array('photos', 4), async (req, res) => { 
  const { id } = req.params;
  const { title, description, location, price_per_night } = req.body;
  const photos = req.files.map(file => file.path).join(',');

  try {
    const property = await Property.findOne({
      where: {
        id,
        host_id: req.user.userId
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée.' });
    }

    property.title = title;
    property.description = description;
    property.location = location;
    property.price_per_night = parseFloat(price_per_night);
    property.photos = photos;

    await property.save();

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de la propriété.' });
  }
});

router.delete('/properties/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findOne({ where: { id, host_id: req.user.userId } });
    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée.' });
    }

    await property.destroy();
    res.status(200).json({ message: 'Propriété supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la propriété.' });
  }
});

router.post('/availability', authenticateJWT, async (req, res) => {
  const { property_id, start_date, end_date, total_price } = req.body;

  try {
    const availability = await Availability.create({
      property_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price: parseFloat(total_price),
    });
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la disponibilité.' });
  }
});

router.get('/properties/:id/availabilities', authenticateJWT, async (req, res) => {
  try {
    const availabilities = await Availability.findAll({
      where: {
        property_id: req.params.id
      }
    });
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des disponibilités.' });
  }
});

// Modifier une disponibilité
router.put('/availabilities/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { start_date, end_date, total_price } = req.body;

  try {
    const availability = await Availability.findOne({ where: { id } });
    if (!availability) {
      return res.status(404).json({ message: 'Disponibilité non trouvée.' });
    }

    availability.start_date = start_date;
    availability.end_date = end_date;
    availability.total_price = total_price;

    await availability.save();
    res.status(200).json({ message: 'Disponibilité modifiée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de la disponibilité.' });
  }
});

// Supprimer une disponibilité
router.delete('/availabilities/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availability.findOne({ where: { id } });
    if (!availability) {
      return res.status(404).json({ message: 'Disponibilité non trouvée.' });
    }

    await availability.destroy();
    res.status(200).json({ message: 'Disponibilité supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la disponibilité.' });
  }
});

// Route pour récupérer une disponibilité spécifique
router.get('/availabilities/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availability.findOne({ where: { id } });
    if (!availability) {
      return res.status(404).json({ message: 'Disponibilité non trouvée.' });
    }
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la disponibilité.' });
  }
});

// Nouvelle route pour créer une réservation
router.post('/booking', authenticateJWT, async (req, res) => {
  const { property_id, start_date, end_date, total_price } = req.body;
  const user_id = req.user.userId; // Récupérez l'ID de l'utilisateur à partir du token

  try {
    const booking = await Booking.create({
      property_id,
      user_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price: parseFloat(total_price),
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation.' });
  }
});

module.exports = router;
