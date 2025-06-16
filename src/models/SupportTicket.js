const mongoose = require('mongoose');
const { Schema } = mongoose;

const supportTicketSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
