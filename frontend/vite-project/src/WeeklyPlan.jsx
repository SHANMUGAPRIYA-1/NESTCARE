import { useEffect, useState } from 'react';
import './WeeklyPlan.css';
import { useNavigate } from 'react-router-dom';

function WeeklyPlan() {
  const [mealData, setMealData] = useState([]);
 const navigate=useNavigate();
 const goToNutritionPage = () => {
  navigate('/nutrition');
};
  useEffect(() => {
    fetch('http://localhost:5000/meals')
      .then(response => response.json())
      .then(data => setMealData(data))
      .catch(error => console.error('Error fetching meal data:', error));
  }, []);

  return (
    <div className="diet-plan">
      <header className="header">
      <button onClick={goToNutritionPage} className="back-button">←</button>
        <h1>POSTPARTUM DIET PLAN:</h1>
        <p>Tips for Healthy Eating After Giving Birth</p>
      </header>
      <div className="day-plan">
        {mealData.map((day, index) => (
          <div className="day" key={index}>
            <h2>DAY {day.day}</h2>
            <div className="meals">
              {day.meals.map((meal, mealIndex) => (
                <div className="meal" key={mealIndex}>
                  <div className="meal-number">
                    <p>{meal.mealNumber}</p>
                  </div>
                  <div className="meal-details">
                    <ol>
                      {meal.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyPlan;
