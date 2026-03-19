import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BodyCare from "./BodyCare";
import Nutrition from "./Nutrition";
import Breastfeeding from "./Breastfeeding";
import Exercise from "./Exercise";
import Profile from "./Profile";
import useSpeech from "./useSpeech";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [clickedImage, setClickedImage] = useState(null);
  const { speak, stop } = useSpeech();

  // 🔊 Load voices once
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // 🔊 Page text to speak
  const pageIds = {
    home: "home-content",
    exercises: "exercise-content",
    nutrition: "nutrition-content",
    bodycare: "bodycare-content",
    breastfeeding: "breastfeeding-content",
  };

  const speakPage = () => {
    window.speechSynthesis.cancel();
    const elementId = pageIds[currentPage];
    const element = document.getElementById(elementId);

    if (!element) {
      alert("No content found to read!");
      return;
    }

    const pageText = element.innerText.trim();
    if (!pageText) {
      alert("Page content is empty!");
      return;
    }

    speak(pageText);
  };

  const styles = {
    header: {
      backgroundColor: "#000",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#fff",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    },
    titleContainer: { display: "flex", alignItems: "center" },
    title: { fontSize: "50px", fontWeight: "bold", margin: "0 20px" },
    logo: { width: "50px", height: "50px", marginRight: "10px" },
    nav: { display: "flex", gap: "15px", alignItems: "center" },
    button: {
      padding: "15px 20px",
      fontSize: "20px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#000",
      marginTop: "10px",
      transition: "background-color 0.3s, transform 0.2s",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    },
    body: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#000",
    },
    imageContainer: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "300px",
      height: "450px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "20px",
      color: "#000",
      margin: "auto",
      overflow: "hidden",
      transition: "transform 0.2s ease",
      boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "20px",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    image: {
      width: "280px",
      height: "290px",
      transition: "transform 0.2s ease, filter 0.3s",
    },
  };

  const images = [
    {
      src: "src/assets/exersices1.jpg",
      name: "Exercises",
      themeColor: "#4CAF50",
    },
    {
      src: "src/assets/nutrition1.jpg",
      name: "Nutrition & Hydration",
      themeColor: "#2196F3",
    },
    {
      src: "src/assets/breastfeeding.jpg",
      name: "Breast Feeding",
      themeColor: "#FF9800",
    },
    {
      src: "src/assets/bodycare.jpg",
      name: "Body Care",
      themeColor: "#E91E63",
    },
  ];

  const handleImageHover = (index, enter = true) => {
    const container = document.querySelector(
      `[data-id="image-container-${index}"]`,
    );
    const overlay = document.querySelector(`[data-id="overlay-${index}"]`);
    const image = document.querySelector(`[data-id="image-${index}"]`);
    if (container && overlay && image) {
      container.style.transform = enter ? "scale(1.05)" : "scale(1)";
      image.style.transform = enter ? "scale(1.1)" : "scale(1)";
      overlay.style.opacity = enter ? "1" : "0";
    }
  };

  const handleImageClick = (index) => {
    setClickedImage(index);
    const pageMap = {
      "Body Care": "bodycare",
      "Nutrition & Hydration": "nutrition",
      "Breast Feeding": "breastfeeding",
      Exercises: "exercises",
    };
    setCurrentPage(pageMap[images[index].name] || "home");
  };

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.titleContainer}>
          <img
            src="src/assets/logo1.jpg"
            alt="Nestcare+ Logo"
            style={styles.logo}
          />
          <div style={styles.title}>Nestcare+</div>
        </div>

        <nav style={styles.nav}>
          <Link to="/main">
            <button
              style={styles.button}
              onClick={() => setCurrentPage("home")}
            >
              Home
            </button>
          </Link>
          <button
            style={styles.button}
            onClick={() => setCurrentPage("profile")}
          >
            Profile
          </button>
          <Link to="/vaccination-schedule">
            <button style={styles.button}>Vaccination</button>
          </Link>
          <button style={styles.button} onClick={speakPage}>
            🔊 Listen
          </button>
          <button style={styles.button} onClick={stop}>
            ⏹ Stop
          </button>
        </nav>
      </header>

      {currentPage === "home" && (
        <div id="home-content" style={styles.body}>
          {images.map((image, index) => (
            <div
              key={index}
              data-id={`image-container-${index}`}
              style={styles.imageContainer}
              onMouseEnter={() => handleImageHover(index, true)}
              onMouseLeave={() => handleImageHover(index, false)}
            >
              <img
                data-id={`image-${index}`}
                src={image.src}
                alt={image.name}
                style={{
                  ...styles.image,
                  filter: clickedImage === index ? "grayscale(100%)" : "none",
                }}
                onClick={() => handleImageClick(index)}
              />
              <div data-id={`overlay-${index}`} style={styles.overlay}>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: image.themeColor,
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  {image.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentPage === "profile" && <Profile />}
      {currentPage === "exercises" && <Exercise />}
      {currentPage === "bodycare" && <BodyCare />}
      {currentPage === "nutrition" && <Nutrition />}
      {currentPage === "breastfeeding" && <Breastfeeding />}
    </div>
  );
};

export default Home;
