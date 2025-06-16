const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  cuisine: [String],
  openHours: String,
  language: { type: String, default: 'en' },
  balance: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

vendorSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
