

const bodyCareItems = [
  {
    title: "Skin Care",
    description:
      "Keep your baby's skin clean and dry. Use gentle products specifically designed for babies.",
    image: "src/assets/skincare.jpg",
    themeColor: "#FFCCBC",
  },
  {
    title: "Bathing",
    description:
      "Bathe your baby 2-3 times a week. Use lukewarm water and mild baby soap.",
    image: "src/assets/bathing.jpg",
    themeColor: "#BBDEFB",
  },
  {
    title: "Umbilical Cord Care",
    description:
      "Keep the umbilical cord stump clean and dry until it falls off naturally.",
    image: "src/assets/umbilical_cord_care.jpg",
    themeColor: "#C8E6C9",
  },
  {
    title: "Nail Care",
    description:
      "Trim your baby's nails regularly to prevent scratches. Use baby nail clippers or a file.",
    image: "src/assets/nail_care.jpg",
    themeColor: "#D1C4E9",
  },
  // Existing items
  {
    title: "Hair Care",
    description: "Gently wash and comb the baby's hair.",
    image: "src/assets/haircare.jpg",
    themeColor: "#FFECB3",
  },
  {
    title: "Diaper Care",
    description: "Change diapers frequently to prevent rashes.",
    image: "src/assets/diapercare.jpg",
    themeColor: "#FFE0B2",
  },
  {
    title: "Eye Care",
    description: "Clean the baby's eyes with a soft, damp cloth.",
    image: "src/assets/eyecare.jpg",
    themeColor: "#FFCDD2",
  },
  {
    title: "Oral Care",
    description: "Clean the baby's gums with a soft, damp cloth.",
    image: "src/assets/oralcare.jpg",
    themeColor: "#C5CAE9",
  },
  {
    title: "Massage",
    description: "Gently massage the baby to improve blood circulation.",
    image: "src/assets/massage.jpg",
    themeColor: "#B3E5FC",
  },
  {
    title: "Sleeping",
    description:
      "Ensure the baby sleeps in a safe and comfortable environment.",
    image: "src/assets/sleeping.jpg",
    themeColor: "#DCEDC8",
  },
  {
    title: "Clothing",
    description: "Dress the baby in soft, breathable clothing.",
    image: "src/assets/clothing.jpg",
    themeColor: "#F8BBD0",
  },
  {
    title: "Sun Protection",
    description: "Protect the baby's skin from direct sunlight.",
    image: "src/assets/sunprotection.jpg",
    themeColor: "#D1C4E9",
  },
  {
    title: "Ear Care",
    description: "Gently clean the baby's outer ears with a damp cloth.",
    image: "src/assets/earcare.jpg",
    themeColor: "#FFCCBC",
  },
  {
    title: "Foot Care",
    description: "Keep the baby's feet clean and dry.",
    image: "src/assets/footcare.jpg",
    themeColor: "#C8E6C9",
  },
  {
    title: "Hydration",
    description: "Ensure the baby is well-hydrated with enough fluids.",
    image: "src/assets/hydration.jpg",
    themeColor: "#BBDEFB",
  },
  
  {
    title: "Temperature Regulation",
    description: "Keep the baby at a comfortable temperature.",
    image: "src/assets/temperature.jpg",
    themeColor: "#DCEDC8",
  },
  
];

const bodyCareContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
  backgroundColor: "#f5f5f5",
};

const bodyCareItemStyle = {
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const bodyCareImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
};

const BodyCare = () => {
  return (
    <div style={bodyCareContainerStyle}>
      {bodyCareItems.map((item, index) => (
        <div
          key={index}
          style={{ ...bodyCareItemStyle, backgroundColor: item.themeColor }}
        >
          <img src={item.image} alt={item.title} style={bodyCareImageStyle} />
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BodyCare;