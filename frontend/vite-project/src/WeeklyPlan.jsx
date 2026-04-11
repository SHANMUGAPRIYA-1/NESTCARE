import { useEffect, useState } from "react";
import "./WeeklyPlan.css";
import { useNavigate } from "react-router-dom";

function WeeklyPlan() {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goToNutritionPage = () => {
    navigate("/nutrition");
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:5000/meals");

        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        const data = await response.json();
        setMealData(data);
      } catch (err) {
        console.error("Error fetching meal data:", err);
        setError("Unable to load meal plan. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="diet-plan">
      <header className="header">
        <button onClick={goToNutritionPage} className="back-button">
          ←
        </button>
        <h1>POSTPARTUM DIET PLAN</h1>
        <p>Tips for Healthy Eating After Giving Birth</p>
      </header>

      {loading && <p className="status-msg">Loading meal plan...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="day-plan">
          {mealData.map((day, index) => (
            <div className="day" key={index}>
              <h2>DAY {day?.day}</h2>

              <div className="meals">
                {day?.meals?.map((meal, mealIndex) => (
                  <div className="meal" key={mealIndex}>
                    <div className="meal-number">
                      <p>{meal?.mealNumber}</p>
                    </div>

                    <div className="meal-details">
                      <ol>
                        {meal?.items?.map((item, itemIndex) => (
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
      )}
    </div>
  );
}

export default WeeklyPlan;
