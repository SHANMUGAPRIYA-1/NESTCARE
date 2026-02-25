import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './VaccinationForm.css';

const VaccinationForm = ({ onScheduleGenerated }) => {
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before making the request

    try {
      const response = await axios.post('http://localhost:5001/api/schedule', { dob, email });
      onScheduleGenerated(response.data.schedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
      setError('Failed to generate schedule. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Generate Schedule</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

VaccinationForm.propTypes = {
  onScheduleGenerated: PropTypes.func.isRequired,
};

export default VaccinationForm;
