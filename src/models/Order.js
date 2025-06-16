const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    addOns: [{ name: String, price: Number }]
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  scheduledAt: Date,
  notes: String,
  total: Number,
  finalTotal: Number,
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
