const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discountPct: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  expiresAt: Date,
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
