import React, { useState } from 'react';
import ExerciseUpload from './ExerciseUpload';
import ExerciseResult from './ExerciseResult';
import './Exercise.css';

const Exercise = () => {
  const [step, setStep] = useState('upload'); // 'upload' or 'result'
  const [suggestedExercises, setSuggestedExercises] = useState([]);

  const handleAnalysisComplete = (exercises) => {
    setSuggestedExercises(exercises);
    setStep('result');
  };

  const handleBackToUpload = () => {
    setStep('upload');
  };

  return (
    <div className="exercise-flow-root">
      {step === 'upload' ? (
        <ExerciseUpload onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <ExerciseResult exercises={suggestedExercises} onBack={handleBackToUpload} />
      )}
    </div>
  );
};

export default Exercise;
