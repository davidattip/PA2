// routes/bookingRoutes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const Booking = require('../models/booking');

const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.userId }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
});

module.exports = router;
