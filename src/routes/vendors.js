const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, 'i');
  try {
    const vendors = await Vendor.find({ $or: [{ name: regex }, { cuisine: regex }] });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await vendor.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/menu', auth('vendor'), async (req, res) => {
  try {
    const item = new MenuItem({ ...req.body, vendor: req.user.id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/orders/:vendorId', auth('vendor'), async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.params.vendorId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
