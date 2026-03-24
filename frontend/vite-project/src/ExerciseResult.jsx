import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import './Exercise.css';

const ExerciseResult = ({ exercises, onBack }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.durationSeconds || 60);
  const [isFinished, setIsFinished] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const beepInterval = useRef(null);

  const currentExercise = exercises[currentIndex];

  // Beep Audio Logic using Web Audio API (no file needed)
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5); // 0.5s beep
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;

    // Only run the timer if it's not finished and not paused
    if (timeLeft > 0 && !isFinished && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      // Logic for when time runs out
      setIsFinished(true);
      playBeep();
      beepInterval.current = setInterval(playBeep, 1500);
    }

    // This cleanup function is crucial: 
    // It clears the interval whenever the component updates or pauses
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft, isFinished, isPaused]); // Added isPaused to dependencies

  const handleNext = () => {
    // Stop beep
    if (beepInterval.current) {
      clearInterval(beepInterval.current);
    }

    if (currentIndex < exercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(exercises[nextIdx].durationSeconds);
      setIsFinished(false);
      setIsPaused(false);
    } else {
      setAllDone(true);
      // Auto-return home after celebration
      setTimeout(() => {
        navigate('/main');
      }, 6000);
    }
  };

  if (allDone) {
    return (
      <div className="celebration-overlay">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />

        <div className="side-emojis left">🎉</div>
        <div className="side-emojis right">🎊</div>
        <div className="side-emojis left-bottom">🥳</div>
        <div className="side-emojis right-bottom">🍾</div>

        <div style={{ fontSize: '100px' }}>🌟</div>
        <h1 className="celebration-text">WELL DONE!</h1>
        <h2 style={{ color: '#fff', fontSize: '32px' }}>ALL EXERCISES COMPLETED!</h2>
        <p className="sub-celebration">See you tomorrow for the next session.</p>
        <p style={{ color: '#888', marginTop: '40px' }}>Redirecting back to home...</p>
      </div>
    );
  }

  // Safety check
  if (!currentExercise) return <div className="exercise-container">No exercises found. <button onClick={onBack}>Go Back</button></div>;

  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="exercise-container">
      <div className="progress-header">
        <span className="back-link" onClick={onBack}>← Back to Analysis</span>
        <span style={{ fontWeight: 'bold', color: '#888' }}>Exercise {currentIndex + 1} of {exercises.length}</span>
      </div>

      <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#ff5722', transition: 'width 0.5s ease' }}></div>
      </div>

      <div className="exercise-card">
        <div className="gif-container">
          {currentExercise.gifUrl.endsWith('.mp4') || currentExercise.gifUrl.includes('makeagif.com') ? (
            /* Video logic for MP4 or makeagif links */
            <video
              src={currentExercise.gifUrl}
              autoPlay
              loop
              muted
              playsInline
              className="exercise-gif"
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          ) : (
            /* Fallback to Image tag for actual GIFs */
            <img
              src={currentExercise.gifUrl}
              alt={currentExercise.name}
              className="exercise-gif"
            />
          )}
        </div>

        <div className="exercise-info">
          <h2 className="exercise-name">{currentExercise.name}</h2>
          <div className="exercise-reps">{currentExercise.reps}</div>
          <p style={{ color: '#aaa', fontSize: '16px', lineHeight: '1.6' }}>
            {currentExercise.description}
          </p>
          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <b style={{ color: '#4caf50' }}>Benefit:</b> <span style={{ color: '#ddd' }}>{currentExercise.benefits}</span>
          </div>
        </div>
      </div>

      <div className="timer-box">
        <div className={`timer-circle ${isFinished ? 'finished' : ''}`}>
          {timeLeft}
        </div>
        {!isFinished && (
          <button
            className="pause-btn"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}
        <p style={{ color: '#888', margin: '15px 0 0 0' }}>
          {isFinished ? 'Exercise Complete! Click button below to stop beep.' :
            isPaused ? 'Timer paused.' : 'Stay focused... hold the form!'}
        </p>
      </div>

      {isFinished && (
        <button className="next-btn" onClick={handleNext}>
          {currentIndex === exercises.length - 1 ? '✓ Finish Session' : '✓ Done - Next Exercise'}
        </button>
      )}
    </div>
  );
};

export default ExerciseResult;
