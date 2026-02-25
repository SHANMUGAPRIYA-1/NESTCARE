import  { useState, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
// Global styles to remove default margins and padding
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 300px;
  background: linear-gradient(45deg, #8e44ad, #3498db);
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
  padding: 15px;
  border-radius: 5px;
  background-color: #1abc9c;
  transition: background-color 0.3s;

  &:hover {
    background-color: #16a085;
  }
`;

const GuideContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e74c3c, #f1c40f);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  height: 300px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const StepContent = styled.div`
  flex: 1;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

const StepImage = styled.div`
  flex-shrink: 0;
  max-width: 300px;

  img {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    border: 2px solid #ddd;
    object-fit: cover;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
    }
  }
`;

const StepTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: "Georgia", serif;
`;

const StepDescription = styled.ul`
  color: #555;
  padding-left: 20px;
  font-size: 1.1rem;
  font-family: "Courier New", Courier, monospace;
`;

const StepPoint = styled.li`
  margin-bottom: 10px;
  font-size: 1rem;
  line-height: 1.5;
`;

// Define the steps data
const steps = [
  {
    title: "Step 1: Get Comfortable",
    description: [
      "Choose a comfortable chair or couch with good back support.",
      "Use pillows to support your arms and baby.",
      "Ensure your feet are flat on the floor or on a footstool.",
      "Relax your shoulders and neck.",
      "Use a nursing pillow for added comfort.",
    ],
    image:
      "https://cdn.shopify.com/s/files/1/0453/1575/2096/files/bbhugme-pregnancy-nursing-pillows-bbhugme-trade-pregnancy-pillow-kit-dusty-pink-53637125603669_2048x.jpg?v=1720016689",
  },
  {
    title: "Step 2: Hold Your Baby",
    description: [
      "Hold your baby close to your body, with their tummy against your tummy.",
      "Their head should be at your breast level.",
      "Support your baby's neck and shoulders.",
      "Your baby's head, shoulders, and hips should be in a straight line.",
      "Use the cradle or cross-cradle hold.",
    ],
    image:
      "https://thecsrjournal.in/wp-content/uploads/2023/08/Breastfeeding.jpg",
  },
  {
    title: "Step 3: Position Baby's Mouth",
    description: [
      "Encourage your baby to open their mouth wide.",
      "Their mouth should cover more of the areola below the nipple than above.",
      "Ensure your baby's lips are flanged out.",
      "Your baby's chin should touch your breast.",
      "The latch should not be painful.",
    ],
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-2edf3d9f2a205de90a8b679be0d7aa02-lq",
  },
  {
    title: "Step 4: Help Your Baby Latch",
    description: [
      "Bring your baby to your breast, not the other way around.",
      "Ensure their chin touches your breast first.",
      "Their nose should be free and not buried in your breast.",
      "The latch should feel comfortable and not painful.",
      "Listen for your baby swallowing.",
    ],
    image:
      "https://news.sanfordhealth.org/wp-content/uploads/2017/10/ThinkstockPhotos-86810689-1024x683.jpg",
  },
  {
    title: "Step 5: Observe Sucking Pattern",
    description: [
      "Watch for a pattern of short sucks followed by longer, deeper sucking.",
      "This indicates your baby is getting milk.",
      "You should hear your baby swallowing.",
      "Your baby should appear content and relaxed.",
      "Their cheeks should look full and rounded.",
    ],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrLCaIXPvVzEI_I-10Uqo6goBetOz54B4AOA&s",
  },
  {
    title: "Step 6: Ending the Feeding",
    description: [
      "When your baby slows down, gently insert a clean finger into the corner of their mouth to break the suction.",
      "Ensure your baby releases the breast gently.",
      "Avoid pulling your baby off the breast.",
      "Offer the other breast if your baby is still hungry.",
      "End the session with a burp.",
    ],
    image:
      "https://images.ctfassets.net/6m9bd13t776q/er0SZ0XTJXZskcgNrcAje/f01c1cbb0f17a549f3464597acbec3c8/how-to-stop-breastfeeding-hero-shutterstock_2406070699.png?q=75&w=660",
  },
];

const Breastfeeding = () => {
  const [selectedStep, setSelectedStep] = useState(0);
  const sectionRefs = useRef([]);

  const handleSidebarClick = (index) => {
    setSelectedStep(index);
    sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar>
          <Title>Breastfeeding Guide</Title>
          {steps.map((step, index) => (
            <SidebarItem
              key={index}
              onClick={() => handleSidebarClick(index)}
              style={{
                backgroundColor: selectedStep === index ? "#16a085" : "#1abc9c",
              }}
            >
              {step.title}
            </SidebarItem>
          ))}
        </Sidebar>
        <GuideContainer>
          {steps.map((step, index) => (
            <Section
              key={index}
              ref={(el) => (sectionRefs.current[index] = el)}
              style={{
                transform: selectedStep === index ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Step>
                <StepContent>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>
                    {step.description.map((point, idx) => (
                      <StepPoint key={idx}>{point}</StepPoint>
                    ))}
                  </StepDescription>
                </StepContent>
                <StepImage>
                  <img src={step.image} alt={step.title} />
                </StepImage>
              </Step>
            </Section>
          ))}
        </GuideContainer>
      </AppContainer>
    </>
  );
};

export default Breastfeeding;
