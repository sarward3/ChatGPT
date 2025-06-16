const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { processCardPayment } = require('../services/payment');

router.post('/', auth('customer'), async (req, res) => {
  try {
    const { order, method, amount } = req.body;
    const orderDoc = await Order.findById(order);
    if (!orderDoc || orderDoc.customer.toString() !== req.user.id) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    if (method === 'wallet') {
      const Customer = require('../models/Customer');
      const customer = await Customer.findById(req.user.id);
      if (customer.walletBalance < amount) {
        return res.status(400).json({ error: 'Insufficient wallet balance' });
      }
      customer.walletBalance -= amount;
      await customer.save();
    } else if (method === 'card') {
      const result = await processCardPayment(orderDoc, amount);
      if (result.status !== 'success') {
        return res.status(400).json({ error: 'Card payment failed' });
      }
    }
    const payment = new Payment({ order, method, amount, status: 'paid' });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
