const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
