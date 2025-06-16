const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItemSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
