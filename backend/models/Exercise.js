const mongoose = require('mongoose');

// Schema for a single exercise within a session
const exerciseItemSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  description:     { type: String, required: true },
  gifUrl:          { type: String, required: true },
  durationSeconds: { type: Number, required: true }, // countdown timer duration
  reps:            { type: String, required: true },  // e.g. "10 reps x 3 sets"
  benefits:        { type: String, required: true },
});

// Schema for a full exercise session (one per report upload)
const exerciseSchema = new mongoose.Schema({
  userId:         { type: String, default: 'guest' },

  // Parameters extracted from the uploaded report
  deliveryType:   { type: String, enum: ['normal', 'cesarean'], default: 'normal' },
  postpartumWeek: { type: String, enum: ['1-2', '3-6', '7-12', '13+'], default: '1-2' },
  baseWeekNumber: { type: Number, default: 1 }, // numeric week at time of upload e.g. 2
  hasBP:          { type: Boolean, default: false },
  hasDiabetes:    { type: Boolean, default: false },
  hasDiastasis:   { type: Boolean, default: false },
  weight:         { type: String, enum: ['normal', 'high'], default: 'normal' },
  painLevel:      { type: String, enum: ['low', 'medium', 'high'], default: 'low' },

  // The 5 suggested exercises
  exercises: [exerciseItemSchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Exercise', exerciseSchema);
