import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Recommendation.css";
import { useNavigate } from "react-router-dom";
import useSpeech from "./useSpeech"; // ✅ Added

const Recommendation = () => {
  const { speak, stop, pause, resume, isSpeaking, isPaused } = useSpeech(); // ✅ Added

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const navigate = useNavigate();

  const slides = [
    {
      image:
        "https://ch-api.healthhub.sg/api/public/content/96b1f36d3837462d89a5f945ce371d54?v=4c774511&t=livehealthyheaderimage",
      description: "Your Road to Recovery",
      link: "https://www.healthhub.sg/live-healthy/postpartum-nutrition-your-road-to-recovery",
    },
    {
      image:
        "https://static.scientificamerican.com/sciam/cache/file/05BE2BAC-EBE0-4162-91EC5AAA6D8C0814_source.jpg?w=1350",
      description: "Top 5 nutrients you need to know",
      link: "https://www.scientificamerican.com/article/top-5-nutrients-for-postpartum-recovery/",
    },
    {
      image:
        "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2024/01/2439988-10-best-postnatal-vitamins-2023-How-to-choose-and-what-to-know-Header-92a9c6-2.jpg",
      description: "Postnatal Vitamins",
      link: "https://www.medicalnewstoday.com/articles/postnatal-vitamins#1",
    },
    {
      image:
        "https://cdn2.momjunction.com/wp-content/uploads/2022/10/Avoid-eating-street-foods-during-pregnancy.jpg.avif",
      description: "Foods that need to be avoided",
      link: "https://www.momjunction.com/articles/post-pregnancy-diet-eat-avoid_0087/",
    },
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsC2pTOM_jpnw2B3pR4HcVmeQSMR3XjiiyFQ&s",
      description: "Baby nutrition",
      link: "https://www.webmd.com/parenting/baby/nutrition",
    },
  ];

  const goToNutritionPage = () => {
    navigate("/nutrition");
  };

  // ✅ Create speech content dynamically
  const handleSpeak = () => {
    const articleTitles = slides.map((slide) => slide.description).join(". ");
    const content = `
      Here are some excellent articles that can guide you through the most healthiest postnatal journey.
      ${articleTitles}
    `;
    speak(content);
  };

  return (
    <div>
      {/* 🔊 Voice Controls Added */}
      <div style={{ textAlign: "center", margin: "20px" }}>
        <button onClick={handleSpeak} disabled={isSpeaking}>
          🔊 Speak
        </button>

        <button onClick={pause} disabled={!isSpeaking}>
          ⏸ Pause
        </button>

        <button onClick={resume} disabled={!isPaused}>
          ▶ Resume
        </button>

        <button onClick={stop}>⏹ Stop</button>
      </div>

      <button onClick={goToNutritionPage} className="back-button">
        ←
      </button>

      <div className="intro">
        Here are some excellent articles that can guide you through the most
        healthiest postnatal journey
      </div>

      <div className="slider">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="slide"
              onClick={() => window.open(slide.link, "_blank")}
            >
              <div
                className="slide-content"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="slide-description">{slide.description}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Recommendation;
