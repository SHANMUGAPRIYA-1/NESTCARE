const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  day: Number,
  meals: [{
    mealNumber: String,
    items: [String]
  }]
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
