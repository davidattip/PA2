// routes/documentRoutes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploadMiddleware');
const PersonalDocument = require('../models/PersonalDocument');
const PropertyDocument = require('../models/PropertyDocument');

const router = express.Router();

router.post('/personal-documents', authenticateJWT, upload.fields([{ name: 'identity_document' }, { name: 'residence_proof' }]), async (req, res) => {
    const { userId } = req.user;

    try {
        const documents = [];
        for (const [key, value] of Object.entries(req.files)) {
            documents.push({
                user_id: userId,
                document_type: key,
                file_path: value[0].path,
            });
        }

        await PersonalDocument.bulkCreate(documents);
        res.status(201).json({ message: 'Documents personnels téléchargés avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement des documents personnels.', error });
    }
});

router.post('/property-documents', authenticateJWT, upload.fields([{ name: 'property_title' }, { name: 'dpe' }]), async (req, res) => {
    const { property_id } = req.body;

    try {
        const documents = [];
        for (const [key, value] of Object.entries(req.files)) {
            documents.push({
                property_id,
                document_type: key,
                file_path: value[0].path,
            });
        }

        await PropertyDocument.bulkCreate(documents);
        res.status(201).json({ message: 'Documents de la propriété téléchargés avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement des documents de la propriété.', error });
    }
});

router.get('/personal-documents', authenticateJWT, async (req, res) => {
    const { userId } = req.user;

    try {
        const documents = await PersonalDocument.findAll({
            where: {
                user_id: userId,
            },
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des documents personnels.', error });
    }
});

router.get('/property-documents/:property_id', authenticateJWT, async (req, res) => {
    const { property_id } = req.params;

    try {
        const documents = await PropertyDocument.findAll({
            where: {
                property_id,
            },
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des documents de la propriété.', error });
    }
});

module.exports = router;
