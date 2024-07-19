// app.js

require('dotenv').config();
const express = require('express');
const initDb = require('./initDb');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');

const adminSubscriptionRoutes = require('./routes/adminSubscriptionRoutes');
const renterRoutes = require('./routes/renterRoutes');
const hostRoutes = require('./routes/hostRoutes');
const documentRoutes = require('./routes/documentRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminServiceRoutes = require('./routes/adminServiceRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const contractorDashboardRoutes = require('./routes/contractorDashboardRoutes');
const contractorCompanyRoutes = require('./routes/contractorCompanyRoutes');
const adminContractorServiceRoutes = require('./routes/adminContractorServiceRoutes');
const contractorServicesRoutes = require('./routes/contractorServicesRoutes');

const adminContractorRoutes = require('./routes/adminContractorRoutes');
const adminHostRoutes = require('./routes/adminHostRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const hostSubscriptionRoutes = require('./routes/hostSubscriptionRoutes'); 
const hostServiceRoutes = require('./routes/hostServiceRoutes');

app.use(helmet());

//Configurer le serveur backend pour accepter les requêtes de l'émulateur Android :
// également autoriser les requêtes provenant de
// l'émulateur Android (qui utilise 10.0.2.2 pour accéder à l'hôte)

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://10.0.2.2:3000',
    'https://paris2a5caretakers.com',
    'http://92.222.216.216:3000',
    'https://92.222.216.216:3000',
    'http://10.33.5.4:3001'//app mobile nation
  ],
  credentials: true
}));

app.options('*', cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://10.0.2.2:3000',
    'https://paris2a5caretakers.com',
    'http://92.222.216.216:3000',
    'https://92.222.216.216:3000',
    'http://10.33.5.4:3001' //app mobile nation
  ],
  credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin', adminContractorRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/admin', adminServiceRoutes);
app.use('/api/admin', adminSubscriptionRoutes);
app.use('/api/contractor', contractorRoutes);
app.use('/api/admin/hosts', adminHostRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/host', hostSubscriptionRoutes);
app.use('/api/host', hostServiceRoutes);
app.use('/api/companies', contractorCompanyRoutes);
app.use('/api/contractor', contractorDashboardRoutes);
app.use('/api/contractor/services', contractorServicesRoutes);
app.use('/api/admin', adminContractorServiceRoutes);

app.use('/api/admin/hosts', adminHostRoutes);
app.use('/api/ticket', ticketRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
