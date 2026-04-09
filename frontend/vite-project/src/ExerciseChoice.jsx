import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Exercise.css";

const ExerciseChoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate months + days from a past date to now
  const calcPostpartumPeriod = (uploadedAt) => {
    const uploaded = new Date(uploadedAt);
    const now = new Date();
    const diffMs = now - uploaded;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return { months, days, diffDays };
  };

  const handleContinueOldReport = async () => {
    setLoading(true);
    setError("");

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData.email || "guest";

      const response = await axios.get(
        `http://localhost:5001/api/exercise/latest/${userId}`
      );

      if (response.data.success && response.data.session) {
        const session = response.data.session;
        const { months, days, diffDays } = calcPostpartumPeriod(session.createdAt);

        // Determine postpartum stage label
        let stageLabel = "";
        if (diffDays < 14)        stageLabel = "Week 1–2 (Early Recovery)";
        else if (diffDays < 42)   stageLabel = "Week 3–6 (Gentle Activity)";
        else if (diffDays < 84)   stageLabel = "Week 7–12 (Progressive)";
        else                       stageLabel = "Week 13+ (Moderate–Intense)";

        navigate("/exercise/result", {
          state: {
            exercises: session.exercises,
            postpartumInfo: {
              months,
              days,
              stageLabel,
              reportDate: session.createdAt,
            },
          },
        });
      } else {
        setError("No previous report found. Please upload a new report.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("No previous report found. Please upload a new report first.");
      } else {
        setError("Could not fetch your report. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontSize: "60px", marginBottom: "15px" }}>🤱</div>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Exercise Session
        </h1>
        <p style={{ color: "#aaa", fontSize: "16px" }}>
          Choose how you'd like to start your postpartum exercise session.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "460px",
          margin: "0 auto",
        }}
      >
        {/* Continue with Old Report */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            border: "1px solid #4caf50",
            borderRadius: "16px",
            padding: "28px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            opacity: loading ? 0.7 : 1,
          }}
          onClick={!loading ? handleContinueOldReport : undefined}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(76,175,80,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
          <h2 style={{ color: "#4caf50", fontSize: "20px", marginBottom: "8px" }}>
            Continue with Old Report
          </h2>
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
            Use your last uploaded medical report. We'll calculate your current
            postpartum stage automatically and show the right exercises.
          </p>
          {loading && (
            <p style={{ color: "#ff9800", marginTop: "12px", fontSize: "14px" }}>
              ⏳ Fetching your report...
            </p>
          )}
        </div>

        {/* Upload New Report */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            border: "1px solid #ff9800",
            borderRadius: "16px",
            padding: "28px",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={() => navigate("/exercise/upload")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,152,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📄</div>
          <h2 style={{ color: "#ff9800", fontSize: "20px", marginBottom: "8px" }}>
            Upload New Report
          </h2>
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
            Upload a fresh postpartum medical report. Our AI will analyse it and
            suggest the safest, most suitable exercises for your current stage.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: "24px",
            padding: "14px 20px",
            background: "rgba(255,82,82,0.12)",
            border: "1px solid #ff5252",
            borderRadius: "12px",
            color: "#ff5252",
            textAlign: "center",
            maxWidth: "460px",
            margin: "24px auto 0",
          }}
        >
          ⚠️ {error}
          <br />
          <button
            className="analyse-btn"
            style={{ marginTop: "14px", fontSize: "14px", padding: "10px 24px" }}
            onClick={() => navigate("/exercise/upload")}
          >
            Upload Report Now →
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseChoice;