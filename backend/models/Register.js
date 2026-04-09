const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const registerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  deliveryType: { type: String, required: true },
  babyArrival: { type: String, required: true },
  babyDOB: { type: Date, required: true },
  mobileNo: { type: Number, required: true }
});

registerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
  }
  next();
});

registerSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Register', registerSchema);
