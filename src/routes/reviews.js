const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', auth('customer'), async (req, res) => {
  try {
    const { vendor, order, rating, comment } = req.body;
    const orderDoc = await Order.findById(order);
    if (!orderDoc || orderDoc.customer.toString() !== req.user.id) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    const review = new Review({ customer: req.user.id, vendor, order, rating, comment });
    await review.save();
    const reviews = await Review.find({ vendor });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Vendor.findByIdAndUpdate(vendor, { rating: avg, $push: { reviews: review._id } });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
