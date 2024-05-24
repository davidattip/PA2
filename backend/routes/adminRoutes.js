const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Importez Op pour les opérations de filtrage
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// S'assurer que la requête est d'abord passée par authenticateJWT puis par isAdmin.

// Route pour afficher la liste des utilisateurs avec pagination et recherche
router.get('/backoffice/users', authenticateJWT, isAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        // Ajoutez une condition de filtrage basée sur le paramètre de recherche
        const whereCondition = search
            ? {
                  [Op.or]: [
                      { first_name: { [Op.like]: `%${search}%` } },
                      { last_name: { [Op.like]: `%${search}%` } },
                      { email: { [Op.like]: `%${search}%` } },
                  ],
              }
            : {};

        // On ne renvoit pas tous les utilisateurs, on pagine les résultats
        const users = await User.findAndCountAll({
            attributes: ['id', 'email', 'first_name', 'last_name', 'user_type'],
            where: whereCondition,
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(users.count / limit);

        // J'envoie la réponse avec les utilisateurs
        res.json({
            users: users.rows,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur interne du serveur." });
    }
});

// Route pour obtenir les détails d'un utilisateur par ID
router.get('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({
            attributes: ['id', 'email', 'first_name', 'last_name', 'user_type'],
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route pour modifier les informations d'un utilisateur par ID
router.put('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, user_type, password } = req.body;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (user_type) user.user_type = user_type;
        if (password) user.password_hash = await bcrypt.hash(password, 10);

        await user.save();

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_type: user.user_type
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route pour enregistrer un administrateur (nécessite un token d'admin)
router.post('/backoffice/add_admin', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_type = 'admin';
        
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
        }

        const user = await User.create({
            email,
            password_hash: hashedPassword,
            first_name,
            last_name,
            user_type // Utiliser la valeur fixe "admin"
        });
        // Peut-être omettre le retour de l'objet utilisateur complet pour des raisons de sécurité
        res.status(201).send({ message: "Admin user created successfully", userId: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route pour supprimer un utilisateur par ID
router.delete('/backoffice/users/:id', authenticateJWT, isAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        await user.destroy();

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});


module.exports = router;
