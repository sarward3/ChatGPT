const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  cuisine: [String]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
