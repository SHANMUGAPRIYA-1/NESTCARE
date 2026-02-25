import { useState } from 'react';
import VaccinationForm from './VaccinationForm';
import VaccinationCalendar from './VaccinationCalendar';
import { useNavigate } from 'react-router-dom';
const VaccinationSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const navigate=useNavigate();
  const goToNutritionPage = () => {
    navigate('/main');
  };
  return (
    <div>
            <button onClick={goToNutritionPage} className="back-button">←</button>
      <br></br><br></br>
      <h1>Vaccination Schedule</h1>
     
      <VaccinationForm onScheduleGenerated={setSchedule} />
      {schedule.length > 0 && (
        <VaccinationCalendar schedule={schedule} />
      )}
    </div>
  );
};

export default VaccinationSchedule;
