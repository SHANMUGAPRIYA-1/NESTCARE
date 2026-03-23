import React, { useState } from 'react';
import axios from 'axios';
import './Exercise.css';

const ExerciseUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setExtractedData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF or TXT report first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('report', file);
    // Optional: get actual userId from localStorage if available
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    formData.append('userId', userData.email || 'guest');

    try {
      const response = await axios.post('http://localhost:5001/api/exercise/suggest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setExtractedData(response.data);
      } else {
        setError('Analysis failed. Please try a clearer report.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Server error. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <h1 style={{ fontSize: '40px', marginBottom: '10px' }}>Step 1: Upload Report</h1>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>
        Upload your postpartum medical report. Our Gemini AI will analyse it to suggest the safest exercises for you.
      </p>

      {!extractedData ? (
        <div className="upload-card" onClick={() => document.getElementById('reportInput').click()}>
          <div className="upload-icon">📄</div>
          {file ? (
            <p style={{ fontSize: '18px', color: '#ff9800' }}>Selected: <b>{file.name}</b></p>
          ) : (
            <p>Click to browse or drag & drop your report (.pdf, .txt)</p>
          )}
          <input
            id="reportInput"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="analysis-summary">
          <h3 style={{ color: '#4caf50', marginBottom: '20px' }}>✓ Report Analysed Successfully</h3>

          <div className="param-card">
            <div className="param-item"><span>Delivery</span><b>{extractedData.extractedParams.deliveryType}</b></div>
            <div className="param-item"><span>Stage</span><b>Week {extractedData.extractedParams.postpartumWeek}</b></div>
            <div className="param-item"><span>Pain</span><b>{extractedData.extractedParams.painLevel}</b></div>
            <div className="param-item"><span>BP</span><b>{extractedData.extractedParams.hasBP ? 'Elevated' : 'Normal'}</b></div>
            <div className="param-item"><span>Diabetes</span><b>{extractedData.extractedParams.hasDiabetes ? 'Yes' : 'No'}</b></div>
            <div className="param-item"><span>Weight</span><b>{extractedData.extractedParams.weight}</b></div>
          </div>

          <div style={{ textAlign: 'left', background: '#333', padding: '15px', borderRadius: '12px', fontSize: '14px', fontStyle: 'italic', marginBottom: '20px' }}>
            <span style={{ color: '#ff9800', fontWeight: 'bold' }}>AI Reasoning:</span> "{extractedData.reasoning}"
          </div>

          <button className="analyse-btn" onClick={() => onAnalysisComplete(extractedData.exercises)}>
            Start Exercises Now →
          </button>
        </div>
      )}

      {error && <p style={{ color: '#ff5252', marginTop: '20px' }}>{error}</p>}

      {!extractedData && (
        <button
          className="analyse-btn"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? 'AI is Analysing...' : 'Analyse Report with Gemini AI'}
        </button>
      )}
    </div>
  );
};

export default ExerciseUpload;
