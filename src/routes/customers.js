const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await customer.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders', auth('customer'), async (req, res) => {
  try {
    const order = new Order({ ...req.body, customer: req.user.id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
