
import { useNavigate } from 'react-router-dom';
import './Recipe.css';

const recipes = [
  {
    "name": "Banana and Fig Porridge",
    "photo": "https://assets.babycenter.com/ims/2017/09/iStock-626393768_4x3.jpg?width=1026",
    "ingredients": [
      "1 cup broken wheat porridge (daliya)",
      "1 fresh fig (anjeer)",
      "1 banana (kela)",
      "Half cup double-toned milk",
      "2 cups water",
      "1 tbsp jaggery (gur) powder",
      "Half teaspoon (nariyal) coconut powder - optional"
    ],
    "method": [
      "Cook the porridge in water. Keep it on low flame until the porridge softens and the water reduces.",
      "Next, add in the milk and let it simmer for another minute while stirring continuously. Add in the jaggery powder and mix well. Remove from the stove.",
      "Add chopped fig and banana and serve. If you prefer, sprinkle some coconut powder."
    ],
    "tip": "Fresh figs can be substituted with dried figs or any other seasonal fruit of your choice. You can also use cold milk if you like your porridge that way. Just pour in the cold milk once the porridge has cooked and cooled."
  },
  {
    "name": "Apple and Oats Porridge",
    "photo": "https://assets.babycenter.com/ims/2017/06/iStock-476263007_4x3.jpg?width=1026",
    "ingredients": [
      "Half cup oats (jaee)",
      "1 cup milk",
      "1 cup filtered water",
      "1 apple (seb), diced",
      "Sugar to taste"
    ],
    "method": [
      "Boil the water and add the oats and cook for about 2 to 3 minutes until they are soft and mushy. Next add in the milk while stirring constantly. Add the sugar and diced apple pieces while the porridge is still hot. Mix well and serve."
    ],
    "variation": "For a non-cook version replace oats with packaged, ready-to-eat puffed amaranth seeds and mix with warm or cold milk. You can also replace the apple with any other fruit of your choice. Pears (nashpati), peach (adoo) apricot (khubani), sapodilla (cheeku), mango (aam) and strawberries all work well."
  },
  {
    "name": "Almond Soup",
    "photo": "https://assets.babycenter.com/ims/2017/09/iStock-496948255_4x3.jpg?width=1026",
    "ingredients": [
      "One fourth cup almonds (badaam) soaked in warm water for 15 minutes",
      "1 small potato (aloo) boiled and mashed",
      "2 medium onions (pyaaz) chopped",
      "3-4 cups vegetable stock or 1 stock cube dissolved in 800ml of water",
      "One fourth cup double-toned milk",
      "1-2 tbsp butter",
      "1 bay leaf (tej patta)",
      "A few mint (pudina) leaves",
      "1 tsp white pepper (safed gol mirch/dakhni mirch) powder",
      "Salt to taste"
    ],
    "method": [
      "Heat the butter in a heavy bottomed pan. Add the bay leaf and immediately add the chopped onions. Sauté on low heat till soft and translucent.",
      "Meanwhile, peel the soaked almonds and run through a blender with a little milk to make a smooth paste. Add the almond paste, salt, mashed potatoes and half the vegetable stock to the pan and bring to a boil. If using ready-made stock cube, you may not need salt. Cook on low heat while stirring continuously. Add extra stock as needed along with the milk to make a creamy soup.",
      "Season with salt and white pepper powder if required. Serve warm garnished with mint leaves."
    ]
  },
  {
    "name": "Spinach Soup",
    "photo": "https://assets.babycenter.com/ims/2013/08/167490957_4x3.jpg?width=1026",
    "ingredients": [
      "1 large bunch spinach (paalak) leaves, washed and chopped",
      "1 medium onion (pyaaz) chopped",
      "3 cloves of garlic (lehsun) chopped",
      "One fourth cup milk",
      "1 small green chilli (hari mirch) chopped",
      "2-3 black peppercorns (kali mirch)",
      "1 tsp lemon (nimbu) juice",
      "Half litre of vegetable stock (or dissolve half a cube of stock in half a litre of water)",
      "1 tsp oil"
    ],
    "method": [
      "Heat the oil in a non-stick pan. Add the garlic and sauté for about half a minute. Add the onions and sauté till soft and translucent.",
      "Next, add the green chillies and black pepper and sauté for a few seconds. Add the chopped spinach leaves and cook with the vegetable stock for about 1 minute on low heat. Take care not to overcook as the spinach will lose its nutrients.",
      "Remove from the flame. Let it cool and then blend to a smooth purée in a mixer. Pour the mixture in a pan, add the milk and cook on a low flame for a minute. Remove from the stove and serve warm. If you prefer, add a dash of lemon juice before serving."
    ]
  },
  {
    "name": "Crunchy Peanut and Veggie Salad",
    "photo": "https://assets.babycenter.com/ims/2017/09/iStock-497964562_4x3.jpg?width=1026",
    "ingredients": [
      "2 cups raw peanuts (moongphali), shelled and pressure-cooked",
      "One fourth cup carrots (gajar), chopped",
      "One fourth cup broccoli (hari gobhi) chopped",
      "One fourth cup French beans (beens), chopped",
      "One fourth tsp green chillies (hari mirch), chopped",
      "2 tbsp fresh coriander leaves (hara dhaniya), chopped",
      "One fourth tsp chaat masala",
      "Half tsp cumin (jeera) powder",
      "One fourth tsp pepper (kali mirch) powder",
      "1 tbsp lemon (nimbu) juice",
      "Salt to taste"
    ],
    "method": [
      "Lightly steam all the chopped vegetables and then mix all the ingredients in a bowl. Season with pepper and lime juice. Serve warm or chilled."
    ],
    "note": "You can add or replace these vegetables with any other vegetables of your choice."
  },
  {
    "name": "Baked Chicken Salad",
    "photo": "https://assets.babycenter.com/ims/2014/10/96888500_4x3.jpg?width=1026",
    "ingredients": [
      "200 gm boneless chicken (shredded)",
      "Half cup mushrooms (khumb) chopped",
      "Half cup tomatoes (tamatar) chopped",
      "Half cup mixed red, yellow and green peppers (lal, peeli, hari simla mirch)",
      "One fourth cup broccoli (hari gobhi) - optional",
      "1 onion (pyaaz) chopped diced",
      "2-3 lettuce leaves (salad patta) washed, drained and chopped",
      "1 tsp pepper (kali mirch) crushed coarsely",
      "2 tbsp lemon juice",
      "Salt to taste",
      "Half tsp olive oil"
    ],
    "method": [
      "Marinate the chicken with lemon juice, pepper and salt for about an hour in the refrigerator.",
      "Once done, mix the chicken with the chopped peppers, broccoli, tomatoes and mushrooms in a large mixing bowl. Drizzle olive oil over this and transfer to a baking tray.",
      "Bake in a pre-heated oven at 180 degrees C for about 20-25 minutes. The vegetables should turn slightly crisp around the edges and chicken should be well-cooked. Remove from the oven and let it stand.",
      "Next, take a large bowl and mix the raw onions with the baked chicken and vegetable mixture. Add in the chopped lettuce leaves and give it a nice toss. Serve immediately or slightly chilled."
    ]
  },
  {
    "name": "Harira",
    "photo": "https://hostthetoast.com/wp-content/uploads/2019/12/Moroccan-Chickpea-Lentil-Soup-4.jpg",
    "ingredients": [
      "2 tbsp desi ghee",
      "1 tsp grated almonds (badaam)",
      "1 tsp grated pistachio nuts (pista)",
      "1 tsp grated walnuts (akhrot)",
      "1 tsp grated cashew nuts (kaju)",
      "¼ tsp carom seeds (ajwain)",
      "¼ tsp turmeric powder (haldi)",
      "¼ cup powdered sugar (boora) or jaggery (gur)",
      "1 tsp powdered edible gum crystals (gondh)",
      "¼ cup powdered musk melon, watermelon and pumpkin seeds (magaz)",
      "½ tsp powdered cardamom seeds (elaichi)",
      "1 glass filtered water"
    ],
    "method": [
      "Heat the ghee in a pan and add the carom seeds. When the seeds start spluttering add all the dry fruits and seeds (magaz). Stir until the nuts and seeds turn light brown.",
      "Next, sprinkle the powdered gum crystals into the pan and keep stirring until the crystals puff up and the spluttering stops.",
      "Add turmeric powder to the mixture and stir well. Add in water and sugar (or grated jaggery), and bring the mixture to a boil.",
      "Let the mixture cook on a low flame for a few minutes until the ghee starts separating. At this point the mixture should look like a thick syrup. Remove from the flame and pour into a bowl and garnish it with cardamom powder. Serve warm."
    ],
    "note": "The recipe may vary a bit from region to region. Some may add additional ingredients like black pepper (kali mirch), white pepper (dakhni gol mirch), nutmeg (jaiphal) or ginger powder (saunth). You can modify the recipe as per your choice."
  },
  {
    "name": "Panjiri",
    "photo": "https://rakskitchen.net/wp-content/uploads/2022/08/panjiri-recipe.jpg",
    "ingredients": [
      "1kg whole wheat flour (gehun ka atta)",
      "1kg pure desi ghee",
      "½ kg powdered sugar (boora)",
      "250gm finely ground edible gum crystals (gondh)",
      "25gm powdered dried ginger powder (saunth)",
      "100gm puffed lotus seeds (makhane)",
      "100gm dried melon seeds, watermelon seeds, pumpkin seeds (magaz)",
      "50gm powdered carom seeds (ajwain)",
      "200gm almonds (badaam)",
      "200gm cashew nuts (kaaju)",
      "400gm grated dried coconut (sookha nariyal)",
      "100gm walnut (akhrot)",
      "50gm unsalted pistachio nuts (pista)",
      "50gm raisins (kishmish)",
      "50gm flame-of-the-forest (kamarkas) - optional"
    ],
    "method": [
      "Heat half the ghee in a heavy bottomed kadai. Fry all the dry fruits one by one till they turn golden brown - first almonds, then cashew nuts followed by walnuts, pistachio nuts and lastly the seeds. Keep them aside on a paper towel to drain the excess oil.",
      "In the same ghee, fry the kamarkas, remove and keep it aside as well. Next roast the grated coconut and keep it aside.",
      "Now, coarsely grind all the fried dry fruits, except the seeds. Mix the dry fruits, roasted coconut and seeds together in a large pan and keep aside. Grind the kamarkas into fine powder and keep aside in a separate bowl.",
      "Heat the remaining ghee and add in the flour. Roast on medium heat till the colour of the flour changes to golden brown and the ghee separates. Turn down the flame and sprinkle in powdered gum crystals. Keep stirring the mixture until the crystals puff up and the spluttering stops.",
      "Add the powdered saunth and ajwain to the roasted flour and stir the entire mixture a few times to blend in all ingredients. Turn off the flame. Keep on stirring the mixture for another 5 minutes.",
      "Next add the dry fruits, magaz, sugar and kamarkas to the roasted flour and mix again. Transfer the mixture in a large utensil or tray, top it with raisins and let the panjiri cool. Transfer to an air-tight container and enjoy a small bowl everyday."
    ],
    "tip": "The recipe can also be made with sooji instead of whole wheat flour. For a quick halwa, cook two tablespoons of panjiri in cup of water or milk till it thickens."
  },
  {
    "name": "Flaxseed Roti",
    "photo": "https://assets.babycenter.com/ims/2015/09/504400371_4x3.jpg?width=1026",
    "ingredients": [
      "1 cup wholewheat flour (atta)",
      "3 tbsp flax (alsi) seeds",
      "One fourth tsp cumin (jeera) seeds",
      "1 tbsp oil or ghee (optional)",
      "Salt to taste"
    ],
    "method": [
      "Dry roast the flax seeds until they start to splutter. Remove from the flame and set aside to cool. Next, dry roast the cumin seeds separately, and remove from the flame. Once cooled, grind both the seeds to a fine powder in a mixer/grinder.",
      "To the wholewheat flour, add the flax seeds-cumin seeds powder, and salt. Knead well with sufficient water to make a soft dough. Cover the dough with a damp cloth and keep aside for 10 to 20 minutes.",
      "Once set, divide the dough into small ball-shaped portions, and roll into rotis by sprinkling wheat flour on both sides. Cook each roti on a hot tava. Flip again and again until they are well cooked and golden on both sides.",
      "If you wish, you could use little oil or ghee on the rotis. Serve hot with your favourite curry or dal."
    ]
  },
  {
    "name": "Stuffed Roti or Paranthas",
    "photo": "https://assets.babycenter.com/ims/2017/09/iStock-520961869_4x3.jpg?width=1026",
    "ingredients": [
      "2 cups wholewheat flour (atta)",
      "1 cup vegetables of your choice for stuffing",
      "1 tbsp green chillies (hari mirch) finely chopped",
      "1 medium sized onion (pyaaz) finely chopped",
      "Half tsp cumin (jeera) powder",
      "Half tsp red chilli (lal mirch) powder",
      "1 tbsp fresh coriander leaves (hara dhaniya), chopped",
      "1 tbsp oil/ghee",
      "Salt to taste"
    ],
    "method": [
      "Knead the flour to make a smooth dough. Cover with a clean, damp cloth and keep aside.",
      "Prepare the vegetable stuffing as required. You can use freshly boiled vegetables or any leftover dal or vegetables.",
      "Divide the dough into equal ball-shaped portions. Take a ball of dough and roll out paranthas, take a spoonful of the stuffing, fold over and roll out again. Roast the parantha on a tava until well cooked on both sides.",
      "Repeat with the rest of the dough and filling. Serve hot with curd, pickle or chutney."
    ],
    "tip": "Wholewheat paranthas can be stuffed with vegetables such as potatoes (aloo), peas (matar) cauliflower (gobhi), radish (mooli), carrots (gajar), beetroot (chukundar), spinach (paalak), fenugreek (methi) or any leftover dry sabzi. For a protein rich version try stuffing paranthas with cooked dal, sprouts, cottage cheese (paneer), soya granules or minced chicken/mutton (keema)."
  },
  {
    "name": "Vegetable Pulao",
    "photo": "https://assets.babycenter.com/ims/2014/10/481711353_4x3.jpg?width=1026",
    "ingredients": [
      "2 cups rice",
      "Half cup cauliflower (phool gobhi) florets, small",
      "One fourth cup green peas (matar)",
      "One fourth cup mixed red, yellow and green capsicum (Shimla mirch)",
      "One fourth cup sweet corn",
      "One fourth cup carrots (gajar) chopped",
      "Half cup onion (pyaaz), chopped",
      "1 cup tomato (tamatar), chopped",
      "A few florets of broccoli (hari gobhi) - optional",
      "One fourth tsp green chillies (hari mirch), finely chopped",
      "1 tbsp fresh coriander leaves (hara dhaniya), chopped",
      "1 tsp garlic (lehsun), finely chopped",
      "2 tsp ginger (adrak), grated",
      "1 tsp cumin (jeera), seeds",
      "1 bay leaf (tej patta)",
      "Half inch piece of cinnamon (dalchini)",
      "2 cardamoms (elaichi)",
      "2 black pepper corns (kali mirch)",
      "One fourth tsp lemon (nimbu) juice",
      "2 cloves (laung)",
      "1 tsp oil",
      "Water as required",
      "Salt to taste"
    ],
    "method": [
      "Heat the oil in a pan, add the onions and sauté till they turn golden brown. Next add in the cumin seeds. When they crackle add the bay leaf, cardamom, peppercorns, cinnamon stick and cloves. Sauté for a a few seconds.",
      "Add the green chillies, garlic and ginger. Once they turn golden brown and the raw smell goes away, add the tomatoes and cook till the mixture turns mushy and the oil separates.",
      "Now add in all the vegetables, rice and salt, and mix well. Sprinkle some water, cover with a lid keep on simmer until the vegetables and rice are well cooked.",
      "Remove from the flame. Garnish with coriander leaves and serve hot with curd or any raita of your choice."
    ],
    "tip": "For variation you could add paneer cubes or soya granules."
  },
  {
    "name": "Steamed Lemon Fish",
    "photo": "https://assets.babycenter.com/ims/2014/08/463322207_4x3.jpg?width=1026",
    "ingredients": [
      "250-300gms fish fillets of your choice (de-boned)",
      "2 green chillies (hari mirch) slit",
      "2 tbsp lemon (nimbu) juice",
      "1 tsp garlic paste (lehsun)",
      "Half cup tomato (tamatar), sliced",
      "Half cup cucumber (kheera), sliced",
      "1 tbsp mayonnaise",
      "1 tbsp fresh coriander leaves (hara dhaniya), chopped",
      "Pepper (kali mirch) powder to taste",
      "Salt to taste"
    ],
    "method": [
      "Wash the fish fillets and marinate with salt, garlic paste and lemon juice for 20 minutes.",
      "In the meantime, pour water in a steamer. You can also use a microwave steamer, or a pressure cooker (without the weight) or pan with a steaming dish. Place the fish fillets and green chillies in the steaming dish. Steam cook for about six to eight minutes until the fish is flaky.",
      "Remove from the steaming dish and garnish with coriander leaves. Serve with mayonnaise and lemon wedges, tomato and cucumber slices or any salad of your choice."
    ]
  }
];

const Recipes = () => {
  const navigate=useNavigate();
  const goToNutritionPage = () => {
    navigate('/nutrition');
  };
  
  return (
    <div>
                  <button onClick={goToNutritionPage} className="back-button">←</button>

      {recipes.map((recipe, index) => (
        <div key={index} className="recipe-card">
          <div className="recipe-header">
            <img src={recipe.photo} alt={recipe.name} />
            <div className="recipe-details">
              <h2>{recipe.name}</h2>
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
              <h3>Method</h3>
              <ol>
                {recipe.method.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
              {recipe.tip && <p className="tip"><strong>Tip:</strong> {recipe.tip}</p>}
              {recipe.variation && <p className="variation"><strong>Variation:</strong> {recipe.variation}</p>}
              {recipe.note && <p className="note"><strong>Note:</strong> {recipe.note}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recipes;
