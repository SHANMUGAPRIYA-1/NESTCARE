import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Nutrition from './Nutrition';
import WeeklyPlan from './WeeklyPlan';
import Exercise from './Exercise';
import Recommendation from './Recommendation';
import Recipe from './Recipe';
import WaterTracker from './WaterTracker';
import VaccinationSchedule from './VaccinationSchedule';
import Login from './Login';
import Register from './Register';
import './App.css';
import Home from './Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for existing user session
    return !!localStorage.getItem('user');
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/nutrition" element={isAuthenticated ? <Nutrition /> : <Navigate to="/" />} />
        <Route path="/weekly-plan" element={isAuthenticated ? <WeeklyPlan /> : <Navigate to="/" />} />
        <Route path="/recommendation" element={isAuthenticated ? <Recommendation /> : <Navigate to="/" />} />
        <Route path="/recipe" element={isAuthenticated ? <Recipe /> : <Navigate to="/" />} />
        <Route path="/hydra" element={isAuthenticated ? <WaterTracker /> : <Navigate to="/" />} />
        <Route path="/vaccination-schedule" element={isAuthenticated ? <VaccinationSchedule /> : <Navigate to="/" />} />
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/main" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exercise" element={isAuthenticated ? <Exercise /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
