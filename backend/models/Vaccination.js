const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccine: String,
  dueDate: Date,
  email: String
});

module.exports = mongoose.model('Vaccination', VaccinationSchema);
