/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import useSpeech from "./useSpeech";

// Animated yoga pose images
const yogaImages = [
  "https://cdnl.iconscout.com/lottie/premium/thumb/girl-doing-pushup-5445986-4562621.gif",
  "https://i.pinimg.com/originals/0b/c1/1a/0bc11a0103763d2700f80e915e625902.gif",
  "https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_5_Exercises_for_Anterior_Pelvic_Tilt_Bridge.gif",
  "https://www.parents.com/thmb/QSmDZkBRdwjhGQXSRrcdoOLQKvs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/legs-wide-pose-facb19b9513a4868b98ec0a6b8e0cc69.jpg",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_social_share_1200x630_center,f_auto,q_auto:best/newscms/2021_24/1734845/scissor-kicks-kb-main-210617.gif",
];

const yogaPoses = [
  {
    name: "Plank Vinyasa",
    benefits:
      "Improves core strength, stability, and posture while boosting cardiovascular endurance.",
  },
  {
    name: "Locust Pose",
    benefits:
      "Strengthens the muscles of the back, arms, and legs while improving posture and relieving stress.",
  },
  {
    name: "Pelvic Tilts",
    benefits:
      "Helps strengthen abdominal muscles, alleviates back pain, and increases flexibility in the lumbar region.",
  },
  {
    name: "Legs Wide Pose",
    benefits:
      "Enhances hip flexibility, stretches the hamstrings and calves, and improves blood circulation.",
  },
  {
    name: "Scissors",
    benefits:
      "Targets the abdominal muscles, enhancing core strength and stability while improving coordination.",
  },
];

const YogaPosesDisplay = () => {
  // ✅ Use FULL speech hook
  const { speak, stop, pause, resume, isSpeaking, isPaused } = useSpeech();

  const backgroundColors = [
    "#FFE0E6",
    "#E0F7FA",
    "#FFF3E0",
    "#E8F5E9",
    "#F3E5F5",
  ];

  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timer, setTimer] = useState(5);

  // ✅ Countdown Timer (clean version)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      stop(); // stop speech when pose changes

      setCurrentPoseIndex((prevIndex) =>
        prevIndex === yogaPoses.length - 1 ? 0 : prevIndex + 1,
      );

      setTimer(5);
    }

    return () => clearInterval(intervalId);
  }, [timer, stop]);

  // ✅ Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // ✅ Voice Control Function
  const handleVoiceControl = () => {
    const pose = yogaPoses[currentPoseIndex];
    const text = `${pose.name}. Benefits: ${pose.benefits}`;

    if (!isSpeaking) {
      speak(text);
    } else if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    }
  };

  const pose = yogaPoses[currentPoseIndex];

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "'Verdana', sans-serif",
          fontSize: "36px",
          color: "#444",
          marginBottom: "30px",
        }}
      >
        5 Yoga Poses for Postpartum Abs
      </h1>

      {/* 🔊 Voice Controls */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleVoiceControl}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ff5722",
            color: "white",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {!isSpeaking ? "Listen" : isPaused ? "Resume" : "Pause"}
        </button>

        <button
          onClick={stop}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f44336",
            color: "white",
            cursor: "pointer",
          }}
        >
          Stop
        </button>
      </div>

      {/* Timer */}
      <div
        style={{
          fontSize: "48px",
          color: "#ff5722",
          fontWeight: "bold",
          marginBottom: "20px",
          background: "linear-gradient(to right, #f7ff00, #db36a4)",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        {timer}s
      </div>

      {/* Pose Card */}
      <div
        style={{
          backgroundColor: backgroundColors[currentPoseIndex],
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "80%",
          margin: "0 auto",
        }}
      >
        <h2>{pose.name}</h2>

        <img
          src={yogaImages[currentPoseIndex]}
          alt={pose.name}
          style={{
            width: "100%",
            maxHeight: "400px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />

        <p>{pose.benefits}</p>
      </div>
    </div>
  );
};

export default YogaPosesDisplay;
