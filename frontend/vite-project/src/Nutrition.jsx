import './Nutrition.css';
import { Link } from 'react-router-dom';
function Nutrition() {
 
  return (
    <>
      {/* <button onClick={goToNutritionPage} className="back-button">←</button> */}

      <div className="header">
        <p>Nutrition is as essential as your child!!</p>
      </div>
      <div className="content">
        <div className="card" id="one">
          <img src="src/assets/motherhood (1).png" alt="Nutrition 1" />
          <p><b>It is very important that you take good care of yourself after
            giving birth. Eating healthy foods and getting the rest you need
            will help you heal properly and produce breast milk for your newborn.</b></p>
        </div>
        <div className="card" id="two">
          <img src="src/assets/diet (1).png" alt="Nutrition 2" />
          <p><b>Good nutrition is critical for new mothers. Nursing women need about
             500 extra calories each day, as well as plenty of protein, calcium and fluids 
             to stay healthy and produce nutritious breast milk.</b></p>
        </div>
        <div className="card" id="three">
          <img src="src/assets/nutrition.png" alt="Nutrition 3" />
          <p><b>You should aim to eat a balanced diet that includes lean meats, high-fiber
             foods, low-fat dairy products and plenty of fresh fruits and vegetables.</b></p>
        </div>
        <div className="start">IMAGINE ATTAINING THE <em>BEST</em> OF YOUR FITNESS</div>
        <div className="btn">
      <Link to="/recommendation">
        <button className="button-53" role="button">Recommendation</button>
      </Link>
      <Link to="/recipe">
        <button className="button-54" role="button">Recipe</button>
      </Link>
        </div>
        <div className='hydra'>
        <Link to="/hydra">
        <button className="button-55" role="button">Water intake tracker</button>
      </Link>
        </div>
      </div>

    </>
  );
}

export default Nutrition;
