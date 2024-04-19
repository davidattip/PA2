require('dotenv').config(); //pour charger les variables d'environnement au démarrage de l'app
const express = require('express');
const initDb = require('./initDb'); // Importez la fonction de synchronisation de la DB
const app = express();
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const renterRoutes = require('./routes/renterRoutes');

// Helmet aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
app.use(helmet());

// CORS permet à votre serveur d'accepter des requêtes de différents domaines
//CORS (Cross-Origin Resource Sharing) :
// Si votre API doit être accessible par des clients situés sur des domaines différents,
// pensez à utiliser le middleware cors pour gérer les requêtes cross-origin.
app.use(cors({ origin: 'http://localhost:3000' })); // Configurez selon vos besoins


// Parse JSON bodies (comme envoyé par les requêtes API)
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/renter', renterRoutes);

// Autre configuration d'Express...

// Middleware d'erreur générique
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001; // Utilisation de la valeur du PORT définie dans le .env ou 3001 par défaut

// Initialisation de la base de données avant de démarrer le serveur
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1); // Arrêtez l'application si la connexion à la base de données échoue
});




