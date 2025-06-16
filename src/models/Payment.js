const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  method: { type: String, enum: ['cod', 'card', 'wallet'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
