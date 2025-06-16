require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodmarket';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Mongo connection error:', err));

// Routes
const customerRoutes = require('./routes/customers');
const vendorRoutes = require('./routes/vendors');
const riderRoutes = require('./routes/riders');

app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/riders', riderRoutes);

app.get('/', (req, res) => {
  res.send('Food Marketplace API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
