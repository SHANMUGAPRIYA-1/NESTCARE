import { useState } from 'react';
import Confetti from 'react-confetti';
import './WaterTracker.css';
import { useNavigate } from 'react-router-dom';
const WaterTracker = () => {
  const totalWater = 2000; // in milliliters
  const [consumedWater, setConsumedWater] = useState(0);
  const [clickedGlasses, setClickedGlasses] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const glasses = [250, 250, 250, 250, 250, 250, 250, 250];
  const navigate=useNavigate();
  const goToNutritionPage = () => {
    navigate('/nutrition');
  };
  const handleAddWater = (amount, index) => {
    if (!clickedGlasses.includes(index)) {
      setConsumedWater((prev) => {
        const newAmount = Math.min(totalWater, prev + amount);
        if (newAmount === totalWater) {
          setShowConfetti(true);
        }
        return newAmount;
      });
      setClickedGlasses((prev) => [...prev, index]);
    }
  };  

  const remainingWater = totalWater - consumedWater;
  const filledHeight = (consumedWater / totalWater) * 100;

  return (
    <div className="container">
      {showConfetti && <Confetti />}
      <button onClick={goToNutritionPage} className="back-button">←</button>

      <h1>Importance of Drinking Water</h1>
     
      <p>
        Drinking water is essential for maintaining good health. It helps regulate body temperature,
        keeps joints lubricated, prevents infections, delivers nutrients to cells, and keeps organs
        functioning properly. Staying hydrated improves sleep quality, cognition, and mood.
      </p>
      <h2>Track Your Water Intake</h2>
      <h3>Goal: 2 Liters</h3>
      <div className="large-container">
        <div className="remaining" style={{ height: `${100 - filledHeight}%` }}>
          {remainingWater / 1000}L remaining
        </div>
        <div className="filled" style={{ height: `${filledHeight}%` }}></div>
      </div>
      <p>Select how many glasses of water that you have drunk</p>
      <div className="glasses">
        {glasses.map((glass, index) => (
          <div
            key={index}
            className={`glass ${clickedGlasses.includes(index) ? 'disabled' : ''}`}
            onClick={() => handleAddWater(glass, index)}
          >
            <div className="water"></div>
            <span>{glass} ml</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterTracker;
