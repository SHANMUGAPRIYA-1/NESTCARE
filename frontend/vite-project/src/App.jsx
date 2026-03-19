import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation
} from 'react-router-dom';

import Nutrition from './Nutrition';
import WeeklyPlan from './WeeklyPlan';
import Recommendation from './Recommendation';
import Recipe from './Recipe';
import WaterTracker from './WaterTracker';
import VaccinationSchedule from './VaccinationSchedule';
import Login from './Login';
import Register from './Register';
import Home from './Home';

import './App.css';

/* 🔊 GLOBAL VOICE READER */
function VoiceReader() {
  const location = useLocation();

  useEffect(() => {
    const speakPage = () => {
      const text = document.body.innerText;
      if (!text) return;

      // Stop previous speech
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.rate = 0.95;
      speech.pitch = 1;
      speech.volume = 1;

      window.speechSynthesis.speak(speech);
    };

    // Delay so page loads fully
    const timer = setTimeout(() => {
      speakPage();
    }, 500);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [location]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {/* 🔊 Auto Voice For All Pages */}
      <VoiceReader />

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
      </Routes>
    </Router>
  );
}

export default App;