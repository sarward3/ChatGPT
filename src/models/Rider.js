const mongoose = require('mongoose');
const { Schema } = mongoose;

const riderSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  vehicle: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rider', riderSchema);
