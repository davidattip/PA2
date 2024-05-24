const express = require('express');
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authenticateToken');
const { isAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// S'assurer que la requête est d'abord passée par authenticateJWT puis par isAdmin.

// 3 routes dans le fichier

// Route pour afficher la liste des utilisateurs avec pagination

router.get('/backoffice/users', authenticateJWT, isAdmin, async (req, res) => {

    // ajouter des paramètres de requête pour la page et la limite, avec des valeurs par défaut si elles ne sont pas fournies
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // On ne renvoit pas tous les utilisateurs, on pagine les résultats
        const users = await User.findAndCountAll({
            attributes: ['id', 'email', 'first_name', 'last_name', 'user_type'],
            limit: limit,
            offset: offset
           // where: {
                // On peut ajouter des conditions ici si nécessaire
            //}
        });

        const totalPages = Math.ceil(users.count / limit);

        // J'envoie la réponse avec les utilisateurs
        res.json({
            users: users.rows,
            totalPages: totalPages,
            currentPage: page
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

// Route pour créer un nouvel administrateur
router.post('/backoffice/users/admin', authenticateJWT, isAdmin, async (req, res) => {
    const { first_name, last_name, email, user_type, password } = req.body;
  
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
      }
  
      const password_hash = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        user_type,
        password_hash,
      });
  
      res.status(201).json({
        message: "Nouvel utilisateur créé avec succès.",
        user: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          user_type: newUser.user_type,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

module.exports = router;
