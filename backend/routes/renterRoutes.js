const express = require('express');
const { isRenter } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/profile', isRenter, (req, res) => {
    // Logique du profil rentier
});

module.exports = router;
