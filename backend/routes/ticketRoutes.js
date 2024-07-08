// routes/ticketRoutes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateToken');
const Ticket = require('../models/ticket');

const router = express.Router();

// Créer un ticket
router.post('/', authenticateJWT, async (req, res) => {
    const { person, level, description } = req.body;

    try {
        const ticket = await Ticket.create({ person, level, description });
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Erreur lors de la création du ticket:', error);
        res.status(500).send('Erreur interne du serveur.');
    }
});

// Récupérer tous les tickets
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Erreur lors de la récupération des tickets:', error);
        res.status(500).send('Erreur interne du serveur.');
    }
});

// Récupérer un ticket par ID
router.get('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).send('Ticket non trouvé.');
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Erreur lors de la récupération du ticket:', error);
        res.status(500).send('Erreur interne du serveur.');
    }
});

// Mettre à jour un ticket
router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).send('Ticket non trouvé.');
        }
        ticket.status = status;
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du ticket:', error);
        res.status(500).send('Erreur interne du serveur.');
    }
});

// Supprimer un ticket
router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).send('Ticket non trouvé.');
        }
        await ticket.destroy();
        res.status(200).send('Ticket supprimé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression du ticket:', error);
        res.status(500).send('Erreur interne du serveur.');
    }
});

module.exports = router;
