const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  addresses: [String],
  language: { type: String, default: 'en' },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

customerSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
