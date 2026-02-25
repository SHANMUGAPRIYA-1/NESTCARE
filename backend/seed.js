const mongoose = require('mongoose');
const Meal = require('./models/Meal'); // Ensure this points to your Meal model

const mongoURI = 'mongodb://localhost:27017/postnatal';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const mealData = [
  {
    day: 1,
    meals: [
      { mealNumber: '1', items: ['5 oz. full fat Greek yogurt', '1 cup sliced strawberries', '1 tsp honey', '1 tbsp. chia seeds'] },
      { mealNumber: '2', items: ['1 egg', '1/4 avocado', '1 slice whole wheat toast', '1/2 banana'] },
      { mealNumber: '3', items: ['Protein bar (aim for 15+ grams of protein and <10 grams of sugar)'] },
      { mealNumber: '4', items: ['4 oz. chicken or fish', '1/2 cup cooked brown rice', '2 cups cooked vegetable', '1-2 tbsp. olive oil for cooking (plus spices)'] },
      { mealNumber: '5', items: ['2 tbsp. peanut butter', '1 tbsp. jelly', '2 slices whole wheat bread', '1 glass of milk'] },
      { mealNumber: '6', items: ['7 Triscuit crackers', '1 tbsp. cream cheese', 'tomato slices'] },
    ],
  },
  {
    day: 2,
    meals: [
      { mealNumber: '1', items: ['Smoothie:', '1 1/2 cups frozen fruit', '1 cup vegetable protein powder', '1 cup unsweetened almond milk'] },
      { mealNumber: '2', items: ['2 tbsp. hummus', '2 oz. pita chips', '1 cup carrot and celery sticks'] },
      { mealNumber: '3', items: ['3 beef meatballs', '1/2 cup tomato sauce', '1/2 cup cooked whole wheat pasta', '2 tbsp. Parmesan cheese'] },
      { mealNumber: '4', items: ['1 apple', '1 string cheese', '1 handful shelled pistachios'] },
      { mealNumber: '5', items: ['Salad:', '2 cups leafy greens', '2 cups chopped veggies', '2 tbsp. dressing', '3 oz. protein of choice (can add in additional nuts, seeds, dried fruit)'] },
      { mealNumber: '6', items: ['Yogurt popsicle (DIY or try Yasso, Outshine brands)'] },
    ],
  },
  {
    day: 3,
    meals: [
      { mealNumber: '1', items: ['Veggie scramble:', '1 egg + 2 egg whites', '1 cup leftover cooked veggies', '1 slice whole wheat toast', '1 oz. cheese'] },
      { mealNumber: '2', items: ['1 apple', '1 string cheese', '1 handful shelled pistachios'] },
      { mealNumber: '3', items: ['4 oz. chicken or fish', '1/2 cup cooked brown rice', '2 cups cooked vegetable', '1-2 tbsp. olive oil for cooking (plus spices)'] },
      { mealNumber: '4', items: ['Protein bar (aim for 15+ grams of protein and <10 grams of sugar)'] },
      { mealNumber: '5', items: ['Salad:', '2 cups leafy greens', '2 cups chopped veggies', '2 tbsp. dressing', '3 oz. protein of choice (can add in additional nuts, seeds, dried fruit)'] },
      { mealNumber: '6', items: ['5 oz. yogurt', '1/2 cup berries', '1/4 cup granola'] },
    ],
  },
  {
    day: 4,
    meals: [
      { mealNumber: '1', items: ['Egg sandwich(4 slice bread) ','1/2 cup skimmed milk.'] },
      { mealNumber: '2', items: ['green gram sprouts 1 cup'] },
      { mealNumber: '3', items: ['Veg pulav rice 1.5 cup','1 cup Soya Chunk curry','1/2 cup Low fat curd.'] },
      { mealNumber: '4', items: ['1 apple', '1 string cheese', '1 handful shelled pistachios'] },
      { mealNumber: '5', items: ['Almond milk shake 1 cup'] },
      { mealNumber: '6', items: ['3 roti/ Chapathi','Ladies finger subji 1/2 cup.'] },
    ],
  },
  {
    day: 5,
    meals: [
      { mealNumber: '1', items: ['Wheat dosa - 4', 'Egg roast - 1/2 cup (2 eggs)'] },
      { mealNumber: '2', items: ['1 Portion fruit salad', 'Cottage cheese'] },
      { mealNumber: '3', items: ['1.5 cup rice', 'Fish curry - 1 cup (Salmon 80g)', 'Palak subji - 1/2 cup', '1/2 cup low fat curd'] },
      { mealNumber: '4', items: ['1 glass milk'] },
      { mealNumber: '5', items: ['Broken wheat upma - 1 cup', '1/2 cup green beans subji'] },
    ],
  },
  {
    day: 6,
    meals: [
      { mealNumber: '1', items: ['Moong dal cheela with paneer filling - 2'] },
      { mealNumber: '2', items: ['Almond milk shake - 1 glass'] },
      { mealNumber: '3', items: ['1 cup rice', 'Soya chunk curry - 1/2 cup', 'Ladies finger subji - 1/2 cup', 'Small cup low fat curd'] },
      { mealNumber: '4', items: ['1 Portion fruit salad (Include different colors)'] },
      { mealNumber: '5', items: ['3 Roti / chapathi', 'Ridge gourd subji - 1/2 cup'] },
    ],
  },
  {
    day: 7,
    meals: [
      { mealNumber: '1', items: ['Mushroom Paratha - 2', 'Tomato chutney'] },
      { mealNumber: '2', items: ['Plain Yoghurt with raw vegetables / grilled vegetables - 1 cup'] },
      { mealNumber: '3', items: ['1/2 cup rice', '3 medium chapati', 'Chick peas spinach curry - 1/2 cup', 'Snake gourd subji - 1/2 cup'] },
      { mealNumber: '4', items: ['1 cup milk'] },
      { mealNumber: '5', items: ['3 Roti / chapati', '1/2 cup mix veg curry'] }
    ]
  }
];

Meal.insertMany(mealData)
  .then(() => {
    console.log('Data inserted');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
