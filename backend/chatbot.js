const express = require("express");
require('dotenv').config();
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyDTqY5qrL0MS3OI4NSpY7qndc5Q1GUAFRY');

router.post("/api/chat", async (req, res) => {
    console.log("chat request recieved",req.body.message)
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview"
    });

    const prompt = `
You are a maternal healthcare assistant.

Provide concise, clear answers under 200 words. Focus on key points with bullet points or short paragraphs. Avoid lengthy explanations.

Answer questions related to:
- Pregnancy care
- Postpartum recovery
- Newborn baby care
- Nutrition for mother
- Vaccination reminders
- Mental health after delivery

User Question:
${message}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Chatbot error" });
  }
});

module.exports = router;