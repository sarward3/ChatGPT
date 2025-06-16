const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');

router.post('/', auth('customer'), async (req, res) => {
  try {
    const ticket = new SupportTicket({ customer: req.user.id, message: req.body.message });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', auth('admin'), async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/resolve', auth('admin'), async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
