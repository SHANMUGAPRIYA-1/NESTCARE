/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";

// Animated yoga pose images (replace with actual GIF URLs)
const yogaImages = [
  "https://cdnl.iconscout.com/lottie/premium/thumb/girl-doing-pushup-5445986-4562621.gif", // Example GIF for Plank Vinyasa
  "https://i.pinimg.com/originals/0b/c1/1a/0bc11a0103763d2700f80e915e625902.gif", // Example GIF for Locust Pose
  "https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_5_Exercises_for_Anterior_Pelvic_Tilt_Bridge.gif", // Example GIF for Pelvic Tilts
  "https://www.parents.com/thmb/QSmDZkBRdwjhGQXSRrcdoOLQKvs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/legs-wide-pose-facb19b9513a4868b98ec0a6b8e0cc69.jpg", // Example GIF for Legs Wide Pose
  "https://media-cldnry.s-nbcnews.com/image/upload/t_social_share_1200x630_center,f_auto,q_auto:best/newscms/2021_24/1734845/scissor-kicks-kb-main-210617.gif", // Example GIF for Scissors
];

// Yoga pose details
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

// Component for displaying a single yoga pose
const YogaPose = ({ pose, image, backgroundColor }) => (
  <div
    style={{
      backgroundColor,
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      width: "80%", // Increased width
      margin: "0 auto", // Center alignment
    }}
  >
    <h2
      style={{
        fontFamily: "'Arial', sans-serif",
        fontSize: "32px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "10px",
      }}
    >
      {pose.name}
    </h2>
    <img
      src={image}
      alt={pose.name}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "400px",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    />
    <p
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "20px",
        color: "#555",
        textAlign: "center",
      }}
    >
      {pose.benefits}
    </p>
  </div>
);

// Main component to display all yoga poses
const YogaPosesDisplay = () => {
  // Define background colors for each pose
  const backgroundColors = [
    "#FFE0E6",
    "#E0F7FA",
    "#FFF3E0",
    "#E8F5E9",
    "#F3E5F5",
  ];

  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000); // Countdown every second

    if (timer === 0) {
      alert(`Exercise ${currentPoseIndex + 1} completed!`);
      setCurrentPoseIndex((prevIndex) =>
        prevIndex === yogaPoses.length - 1 ? 0 : prevIndex + 1
      );
      setTimer(5);
    }

    return () => clearInterval(intervalId);
  }, [timer, currentPoseIndex]);

  useEffect(() => {
    if (currentPoseIndex === yogaPoses.length - 1 && timer === 0) {
      alert(
        "Congratulations! You've successfully completed all exercises!",
      );
    }
  }, [currentPoseIndex, timer]);

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
      <YogaPose
        pose={yogaPoses[currentPoseIndex]}
        image={yogaImages[currentPoseIndex]}
        backgroundColor={backgroundColors[currentPoseIndex]}
      />
    </div>
  );
};

export default YogaPosesDisplay;
