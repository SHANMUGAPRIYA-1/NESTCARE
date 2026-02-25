
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './VaccinationCalendar.css'

const VaccinationCalendar = ({ schedule }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const vaccination = schedule.find(
        (item) => new Date(item.dueDate).toDateString() === date.toDateString()
      );
      return vaccination ? <p>{vaccination.vaccine}</p> : null;
    }
  };

  return (
    <Calendar
      tileContent={tileContent}
    />
  );
};

VaccinationCalendar.propTypes = {
  schedule: PropTypes.arrayOf(
    PropTypes.shape({
      dueDate: PropTypes.string.isRequired,
      vaccine: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default VaccinationCalendar;
