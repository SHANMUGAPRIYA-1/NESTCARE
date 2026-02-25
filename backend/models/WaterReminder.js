const mongoose = require('mongoose');

const WaterReminderSchema = new mongoose.Schema({
  time: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('WaterReminder', WaterReminderSchema);
