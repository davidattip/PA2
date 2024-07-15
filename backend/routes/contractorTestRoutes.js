// contractorTestRoutes.js
const express = require('express');
const { searchCompanies } = require('../api/sireneApi');

const router = express.Router();

router.get('/test-company', async (req, res) => {
    const { searchTerm } = req.query;
    console.log(`Recherche pour: ${searchTerm}`);

    try {
        const companies = await searchCompanies(searchTerm);
        console.log('Résultats trouvés:', companies);
        res.status(200).json(companies);
    } catch (error) {
        console.error('Erreur lors de la recherche des entreprises:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des entreprises.', error: error.message });
    }
});

module.exports = router;
