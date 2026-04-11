import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState("home"); // ✅ added
  const [showChat, setShowChat] = useState(false);
  const [chatButtonHover, setChatButtonHover] = useState(false);

  const { speak } = useSpeech();

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const styles = {
    header: {
      backgroundColor: "#000000",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#ffffff",
      marginBottom: "20px",
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "40px",
      fontWeight: "bold",
      margin: "0 20px",
    },
    logo: {
      width: "50px",
      height: "50px",
    },
    nav: {
      display: "flex",
      gap: "15px",
    },
    button: {
      padding: "10px 15px",
      fontSize: "16px",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
      color: "#000",
      border: "none",
    },
    body: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#000",
    },
    imageContainer: {
      position: "relative",
      width: "250px",
      height: "350px",
      backgroundColor: "#fff",
      borderRadius: "15px",
      margin: "auto",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      transition: "0.3s",
    },
    chatButton: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      background: "#6c63ff",
      color: "#fff",
      fontSize: "24px",
      border: "none",
      cursor: "pointer",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "90%",
      maxWidth: "500px",
    },
  };

  const images = [
    { src: "src/assets/exersices1.jpg", name: "Exercises" },
    { src: "src/assets/nutrition1.jpg", name: "Nutrition & Hydration" },
    { src: "src/assets/breastfeeding.jpg", name: "Breast Feeding" },
    { src: "src/assets/bodycare.jpg", name: "Body Care" },
  ];

  const handleImageClick = (index) => {
    const name = images[index].name;
    if (name === "Exercises") setCurrentPage("exercises");
    else if (name === "Nutrition & Hydration") setCurrentPage("nutrition");
    else if (name === "Breast Feeding") setCurrentPage("breastfeeding");
    else if (name === "Body Care") setCurrentPage("bodycare");
  };

  return (
    <div>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.titleContainer}>
          <img src="src/assets/logo1.jpg" alt="logo" style={styles.logo} />
          <div style={styles.title}>Nestcare+</div>
        </div>

        <nav style={styles.nav}>
          <button style={styles.button} onClick={() => setCurrentPage("home")}>
            Home
          </button>

          <button style={styles.button} onClick={() => setCurrentPage("profile")}>
            Profile
          </button>

          <Link to="/vaccination-schedule">
            <button style={styles.button}>Vaccination</button>
          </Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      {currentPage === "home" && (
        <div style={styles.body}>
          {images.map((img, index) => (
            <div key={index} style={styles.imageContainer}>
              <img
                src={img.src}
                alt={img.name}
                style={styles.image}
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
      )}

      {currentPage === "profile" && <Profile />}
      {currentPage === "exercises" && <Exercise />}
      {currentPage === "bodycare" && <BodyCare />}
      {currentPage === "nutrition" && <Nutrition />}
      {currentPage === "breastfeeding" && <Breastfeeding />}

      {/* CHAT BUTTON */}
      <button
        style={styles.chatButton}
        onClick={() => setShowChat(true)}
      >
        💬
      </button>

      {/* CHAT MODAL */}
      {showChat && (
        <div style={styles.modal} onClick={() => setShowChat(false)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <ChatBot onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;