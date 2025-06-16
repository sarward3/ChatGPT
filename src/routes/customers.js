const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
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
    const { couponCode } = req.body;
    let discount = 0;
    let coupon;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode, expiresAt: { $gt: new Date() } });
      if (!coupon) {
        return res.status(400).json({ error: 'Invalid coupon' });
      }
      discount = coupon.discountAmount || 0;
      if (coupon.discountPct) {
        discount += (req.body.total * coupon.discountPct) / 100;
      }
    }
    const finalTotal = Math.max(0, req.body.total - discount);
    let status = 'pending';
    if (req.body.scheduledAt && new Date(req.body.scheduledAt) > new Date()) {
      status = 'scheduled';
    }
    const order = new Order({ ...req.body, customer: req.user.id, status, coupon: coupon ? coupon._id : undefined, finalTotal });
    await order.save();
    await Customer.findByIdAndUpdate(req.user.id, { $inc: { loyaltyPoints: 1 } });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/orders', auth('customer'), async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/wallet', auth('customer'), async (req, res) => {
  try {
    const { amount } = req.body;
    const customer = await Customer.findById(req.user.id);
    customer.walletBalance += amount;
    await customer.save();
    res.json({ walletBalance: customer.walletBalance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/wallet', auth('customer'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    res.json({ walletBalance: customer.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', auth('customer'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
