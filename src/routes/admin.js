const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Rider = require('../models/Rider');
const Coupon = require('../models/Coupon');
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

router.post('/orders/:orderId/assign/:riderId', auth('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.rider = req.params.riderId;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/users', auth('admin'), async (req, res) => {
  try {
    const customers = await Customer.find();
    const vendors = await Vendor.find();
    const riders = await Rider.find();
    res.json({ customers, vendors, riders });
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
    const revenueAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ]);
    const revenue = revenueAgg[0] ? revenueAgg[0].total : 0;
    res.json({ orders, customers, vendors, riders, revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/coupons', auth('admin'), async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
