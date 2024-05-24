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

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/host', hostRoutes);

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
