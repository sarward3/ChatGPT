const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  status: { type: String, enum: ['pending', 'accepted', 'preparing', 'ready', 'on_the_way', 'delivered'], default: 'pending' },
  total: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
