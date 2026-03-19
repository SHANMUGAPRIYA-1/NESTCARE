import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./VaccinationCalendar.css";

const VaccinationCalendar = ({ schedule }) => {
  // ✅ Highlight dates that have vaccination
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const hasVaccine = schedule.some(
        (item) => new Date(item.dueDate).toDateString() === date.toDateString(),
      );
      return hasVaccine ? "vaccine-date" : null;
    }
  };

  // ✅ Show vaccine name inside date cell
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const vaccination = schedule.find(
        (item) => new Date(item.dueDate).toDateString() === date.toDateString(),
      );

      return vaccination ? (
        <div className="vaccine-label">{vaccination.vaccine}</div>
      ) : null;
    }
  };

  return (
    <div className="calendar-wrapper">
      <Calendar tileClassName={tileClassName} tileContent={tileContent} />
    </div>
  );
};

VaccinationCalendar.propTypes = {
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      dueDate: PropTypes.string.isRequired,
      vaccine: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default VaccinationCalendar;
