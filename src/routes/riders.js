const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Rider = require('../models/Rider');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const rider = new Rider(req.body);
    await rider.save();
    const token = jwt.sign({ id: rider._id, role: 'rider' }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const rider = await Rider.findOne({ phone });
    if (!rider) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await rider.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: rider._id, role: 'rider' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders/:orderId/status', auth('rider'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = req.body.status;
    order.rider = req.user.id;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
