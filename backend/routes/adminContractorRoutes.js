const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Importez Op pour les opérations de filtrage
const Contractor = require('../models/contractor');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// S'assurer que la requête est d'abord passée par authenticateJWT puis par isAdmin.

// Route pour afficher la liste des contractors avec pagination et recherche
router.get('/backoffice/contractors', authenticateJWT, isAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        // Ajoutez une condition de filtrage basée sur le paramètre de recherche
        const whereCondition = search
            ? {
                [Op.or]: [
                    { contact_first_name: { [Op.like]: `%${search}%` } },
                    { contact_last_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { company_name: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};

        // On ne renvoit pas tous les contractors, on pagine les résultats
        const contractors = await Contractor.findAndCountAll({
            attributes: ['id', 'email', 'contact_first_name', 'contact_last_name', 'user_type', 'company_name', 'siret'],
            where: whereCondition,
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(contractors.count / limit);

        // J'envoie la réponse avec les contractors
        res.json({
            contractors: contractors.rows,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur interne du serveur." });
    }
});

// Route pour obtenir les détails d'un contractor par ID
router.get('/backoffice/contractors/:id', authenticateJWT, isAdmin, async (req, res) => {
    const contractorId = req.params.id;

    try {
        const contractor = await Contractor.findOne({
            attributes: ['id', 'email', 'contact_first_name', 'contact_last_name', 'user_type', 'company_name', 'siret', 'address'],
            where: { id: contractorId }
        });

        if (!contractor) {
            return res.status(404).json({ message: "Contractor non trouvé." });
        }

        res.status(200).json(contractor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route pour modifier les informations d'un contractor par ID
router.put('/backoffice/contractors/:id', authenticateJWT, isAdmin, async (req, res) => {
    const contractorId = req.params.id;
    const { contact_first_name, contact_last_name, email, company_name, siret, address, password } = req.body;

    try {
        const contractor = await Contractor.findOne({ where: { id: contractorId } });

        if (!contractor) {
            return res.status(404).json({ message: "Contractor non trouvé." });
        }

        if (contact_first_name) contractor.contact_first_name = contact_first_name;
        if (contact_last_name) contractor.contact_last_name = contact_last_name;
        if (email) contractor.email = email;
        if (company_name) contractor.company_name = company_name;
        if (siret) contractor.siret = siret;
        if (address) contractor.address = address;
        if (password) contractor.password_hash = await bcrypt.hash(password, 10);

        await contractor.save();

        res.status(200).json({
            message: "Contractor mis à jour avec succès.",
            contractor: {
                id: contractor.id,
                contact_first_name: contractor.contact_first_name,
                contact_last_name: contractor.contact_last_name,
                email: contractor.email,
                company_name: contractor.company_name,
                siret: contractor.siret,
                address: contractor.address,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route pour supprimer un contractor par ID
router.delete('/backoffice/contractors/:id', authenticateJWT, isAdmin, async (req, res) => {
    const contractorId = req.params.id;

    try {
        const contractor = await Contractor.findOne({ where: { id: contractorId } });

        if (!contractor) {
            return res.status(404).json({ message: "Contractor non trouvé." });
        }

        await contractor.destroy();

        res.status(200).json({ message: "Contractor supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

module.exports = router;
