const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Vendor = require('../models/Vendor');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const { io } = require('../index');
const { sendPush } = require('../services/push');

router.get('/search', async (req, res) => {
  const { q, rating, lng, lat, distance } = req.query;
  const regex = q ? new RegExp(q, 'i') : null;
  try {
    const query = {};
    if (regex) {
      query.$or = [{ name: regex }, { cuisine: regex }];
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    if (lng && lat && distance) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(distance)
        }
      };
    }
    const vendors = await Vendor.find(query);
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

router.get('/menu/:vendorId', async (req, res) => {
  try {
    const menu = await MenuItem.find({ vendor: req.params.vendorId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/menu/:itemId', auth('vendor'), async (req, res) => {
  try {
    const item = await MenuItem.findOneAndUpdate({ _id: req.params.itemId, vendor: req.user.id }, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
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

router.post('/orders/:orderId/status', auth('vendor'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, vendor: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    io.emit('orderUpdated', order);
    sendPush('customer-' + order.customer, `Order ${order._id} now ${order.status}`);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/coupons', auth('vendor'), async (req, res) => {
  try {
    const coupon = new Coupon({ ...req.body, vendor: req.user.id });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/profile', auth('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/analytics', auth('vendor'), async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id, status: 'delivered' });
    const revenue = orders.reduce((t, o) => t + (o.finalTotal || o.total), 0);
    res.json({ orders: orders.length, revenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
