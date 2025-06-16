const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const customerRoutes = require('./routes/customers');
const vendorRoutes = require('./routes/vendors');
const riderRoutes = require('./routes/riders');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Food Marketplace API');
});

module.exports = app;
