const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Rider = require('../models/Rider');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders', auth('admin'), async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics', auth('admin'), async (req, res) => {
  try {
    const orders = await Order.countDocuments();
    const customers = await Customer.countDocuments();
    const vendors = await Vendor.countDocuments();
    const riders = await Rider.countDocuments();
    res.json({ orders, customers, vendors, riders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
