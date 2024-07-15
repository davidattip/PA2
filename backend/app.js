require('dotenv').config();
const express = require('express');
const initDb = require('./initDb');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes'); // Ajoutez cette ligne
const renterRoutes = require('./routes/renterRoutes');
const hostRoutes = require('./routes/hostRoutes');
const documentRoutes = require('./routes/documentRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const contractorRoutes = require('./routes/contractorRoutes');
const contractorTestRoutes = require('./routes/contractorTestRoutes');
const companyRoutes = require('./routes/companyRoutes');


const adminHostRoutes = require('./routes/adminHostRoutes');
const ticketRoutes = require('./routes/ticketRoutes');



app.use(helmet());


//Configurer le serveur backend pour accepter les requêtes de l'émulateur Android :
// également autoriser les requêtes provenant de
// l'émulateur Android (qui utilise 10.0.2.2 pour accéder à l'hôte)

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://10.0.2.2:3000'],
  credentials: true
}));

app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Middleware pour ajouter des en-têtes CORS pour les fichiers statiques
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000, http://127.0.0.1:3000, http://10.0.2.2:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminUserRoutes); // Ajoutez cette ligne
app.use('/api/renter', renterRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/document', documentRoutes);

//contractor
app.use('/api/contractor', contractorRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/contractor-test', contractorTestRoutes);

app.use('/api/admin/hosts', adminHostRoutes);
app.use('/api/ticket', ticketRoutes);




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {  // Écoutez sur toutes les interfaces réseau
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
