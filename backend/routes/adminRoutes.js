const express = require('express');
const { isAdmin } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/dashboard', isAdmin, (req, res) => {
    // Logique du dashboard admin
});

module.exports = router;