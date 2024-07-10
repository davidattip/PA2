//Ce fichier companyRoutes.js permet de faire une abstraction de la complexité
// des appels API et offre une interface simple pour rechercher des entreprises
// depuis votre frontend en utilisant un simple terme de recherche.
// Assurez-vous de bien tester ces interactions et de valider la structure de la réponse de l'API SIRENE
// pour éviter des erreurs de chemin dans les objets retournés.


const express = require('express');
const { searchCompanies } = require('../api/sireneApi');  // Import de la fonction pour rechercher des entreprises

const router = express.Router();

// Route pour obtenir des entreprises basées sur un terme de recherche
router.get('/search', async (req, res) => {
    const { term } = req.query;  // Récupération du terme de recherche depuis les paramètres de la requête
    if (!term) {
        return res.status(400).json({ message: 'Search term is required' });  // Validation du terme de recherche
    }

    try {
        const companies = await searchCompanies(term);  // Appel de la fonction pour rechercher des entreprises
        res.json(companies.map(company => ({  // Formatage de la réponse
            siret: company.siret,
            name: company.uniteLegale.denominationUniteLegale  // Assurez-vous que le chemin d'accès est correct selon la structure de votre réponse API
        })));
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
