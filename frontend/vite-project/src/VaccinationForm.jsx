import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./VaccinationForm.css";

const VaccinationForm = ({ onScheduleGenerated }) => {
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!dob || !email) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/schedule", {
        dob,
        email,
      });

      onScheduleGenerated(response.data.schedule);
      setSuccess("Schedule generated successfully ✅");
    } catch (error) {
      console.error("Error generating schedule:", error);
      setError("Failed to generate schedule. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="vaccination-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Schedule"}
      </button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
};

VaccinationForm.propTypes = {
  onScheduleGenerated: PropTypes.func.isRequired,
};

export default VaccinationForm;
