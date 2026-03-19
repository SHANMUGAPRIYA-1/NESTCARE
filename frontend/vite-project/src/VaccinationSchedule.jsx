import { useState } from "react";
import VaccinationForm from "./VaccinationForm";
import VaccinationCalendar from "./VaccinationCalendar";
import { useNavigate } from "react-router-dom";
import "./VaccinationSchedule.css";

const VaccinationSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/main");
  };

  return (
    <div className="vaccination-container">
      <button onClick={goToMainPage} className="back-button">
        ←
      </button>

      <h1 className="title">Vaccination Schedule</h1>

      <div className="form-section">
        <VaccinationForm onScheduleGenerated={setSchedule} />
      </div>

      {schedule.length > 0 && (
        <div className="calendar-section">
          <VaccinationCalendar schedule={schedule} />
        </div>
      )}
    </div>
  );
};

export default VaccinationSchedule;
