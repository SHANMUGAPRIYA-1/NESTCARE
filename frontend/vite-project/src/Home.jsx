import { useState } from "react";
import { Link } from "react-router-dom";
import BodyCare from "./BodyCare";
import Nutrition from "./Nutrition";
import Breastfeeding from "./Breastfeeding";
import Exercise from "./Exercise";
import Profile from "./Profile";
import useSpeech from "./useSpeech";
import ChatBot from "./Chatbot";

const Home = () => {
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
  const [showChat, setShowChat] = useState(false);
  const [chatButtonHover, setChatButtonHover] = useState(false);

  const styles = {
    header: {
      backgroundColor: "#000000",
      padding: "20px",
      textAlign: "center",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#ffffff",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "50px",
      fontWeight: "bold",
      margin: "0 20px",
      transition: "color 0.3s ease",
    },
    logo: {
      width: "50px",
      height: "50px",
      marginRight: "10px",
    },
    nav: {
      display: "flex",
      gap: "15px",
    },
    button: {
      padding: "15px 20px",
      fontSize: "20px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
      color: "#000000",
      marginTop: "10px",
      transition: "background-color 0.3s, transform 0.2s",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    },
    chatButton: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontSize: "28px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
      zIndex: 1000,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    chatButtonHover: {
      transform: "scale(1.1)",
      boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.4)",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1001,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80%",
      overflow: "auto",
    },
    body: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#000000",
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
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      color: "#000000",
      margin: "auto",
      overflow: "hidden",
      transition: "transform 0.2s ease",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
    overlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "20px",
      opacity: "0",
      transition: "opacity 0.3s ease",
    },
    image: {
      width: "280px",
      height: "290px",
      transition: "transform 0.2s ease, filter 0.3s ease",
    },
  };

  const images = [
    {
      src: "src/assets/exersices1.jpg",
      alt: "Exercises",
      name: "Exercises",
      themeColor: "#4CAF50",
    },
    {
      src: "src/assets/nutrition1.jpg",
      alt: "Nutrition & Hydration",
      name: "Nutrition & Hydration",
      themeColor: "#2196F3",
    },
    {
      src: "src/assets/breastfeeding.jpg",
      alt: "Breast Feeding",
      name: "Breast Feeding",
      themeColor: "#FF9800",
    },
    {
      src: "src/assets/bodycare.jpg",
      alt: "Body Care",
      name: "Body Care",
      themeColor: "#E91E63",
    },
  ];

  const handleMouseEnter = (index) => {
    const container = document.querySelector(`[data-id="image-container-${index}"]`);
    const overlay = document.querySelector(`[data-id="overlay-${index}"]`);
    const image = document.querySelector(`[data-id="image-${index}"]`);
    if (container && overlay && image) {
      container.style.transform = "scale(1.05)";
      image.style.transform = "scale(1.1)";
      overlay.style.opacity = "1";
    }
  };

  const handleMouseLeave = (index) => {
    const container = document.querySelector(`[data-id="image-container-${index}"]`);
    const overlay = document.querySelector(`[data-id="overlay-${index}"]`);
    const image = document.querySelector(`[data-id="image-${index}"]`);
    if (container && overlay && image) {
      container.style.transform = "scale(1)";
      image.style.transform = "scale(1)";
      overlay.style.opacity = "0";
    }
  };

  const handleImageClick = (index) => {
    const clickedImageName = images[index].name;
    switch (clickedImageName) {
      case "Body Care":
        setCurrentPage("bodycare");
        break;
      case "Nutrition & Hydration":
        setCurrentPage("nutrition");
        break;
      case "Breast Feeding":
        setCurrentPage("breastfeeding");
        break;
      case "Exercises":
        setCurrentPage("exercises");
        break;
      default:
        setClickedImage(index);
    }
  };

  const handleProfileClick = () => {
    setCurrentPage("profile");
  };

  const handleHomeClick = () => {
    setCurrentPage("home");
  };

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.titleContainer}>
          <img src="src/assets/logo1.jpg" alt="Nestcare+ Logo" style={styles.logo} />
          <div style={styles.title}>Nestcare+</div>
        </div>
        <nav style={styles.nav}>
          <Link to="/main">
            <button style={styles.button} onClick={handleHomeClick}>Home</button>
          </Link>
          <button style={styles.button} onClick={handleProfileClick}>Profile</button>
          <Link to="/vaccination-schedule">
            <button style={styles.button}>Vaccination</button>
          </Link>
        </nav>
      </header>
      {currentPage === "home" ? (
        <div style={styles.body}>
          {images.map((image, index) => (
            <div
              key={index}
              data-id={`image-container-${index}`}
              style={styles.imageContainer}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <img
                data-id={`image-${index}`}
                src={image.src}
                alt={image.alt}
                style={{
                  ...styles.image,
                  filter: clickedImage === index ? "grayscale(100%)" : "none",
                }}
                onClick={() => handleImageClick(index)}
              />
              <div data-id={`overlay-${index}`} style={styles.overlay}>
                <button
                  style={{ ...styles.button, backgroundColor: image.themeColor }}
                  onClick={() => handleImageClick(index)}
                >
                  {image.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : currentPage === "profile" ? (
        <Profile />
      ) : currentPage === "exercises" ? (
        <Exercise />
      ) : currentPage === "bodycare" ? (
        <BodyCare />
      ) : currentPage === "nutrition" ? (
        <Nutrition />
      ) : currentPage === "breastfeeding" ? (
        <Breastfeeding />
      ) : null}

      <button
        style={{
          ...styles.chatButton,
          ...(chatButtonHover ? styles.chatButtonHover : {}),
        }}
        onClick={() => setShowChat(true)}
        onMouseEnter={() => setChatButtonHover(true)}
        onMouseLeave={() => setChatButtonHover(false)}
      >
        💬
      </button>

      {showChat && (
        <div style={styles.modal} onClick={() => setShowChat(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <ChatBot onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
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
