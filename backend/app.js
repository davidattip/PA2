require('dotenv').config();
const express = require('express');
const initDb = require('./initDb');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const renterRoutes = require('./routes/renterRoutes');
const hostRoutes = require('./routes/hostRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const documentRoutes = require('./routes/documentRoutes');
const adminHostRoutes = require('./routes/adminHostRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Middleware pour ajouter des en-têtes CORS pour les fichiers statiques
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000, http://127.0.0.1:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/admin/hosts', adminHostRoutes);
app.use('/api/ticket', ticketRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
