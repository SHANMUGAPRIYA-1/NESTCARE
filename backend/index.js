const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const Register = require("./models/Register");
const Vaccination = require("./models/Vaccination"); // ✅ Added
// Move this here to ensure body-parser is ready

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const chatbotRoute = require("./chatbot");
app.use("/api", chatbotRoute);

/* ==============================
   MongoDB Connection
============================== */
mongoose
  .connect("mongodb://localhost:27017/Idea-Ignite")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ==============================
   REGISTER ROUTE
============================== */
app.post("/register", async (req, res) => {
  const formData = req.body;

  const newRegister = new Register({
    email: formData.email,
    name: formData.name,
    age: formData.age,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    deliveryType: formData.deliveryType,
    babyArrival: formData.babyArrival,
    babyDOB: formData.babyDOB,
  });

  try {
    const savedData = await newRegister.save();
    console.log("Saved data:", savedData);
    res.status(201).json(savedData);
  } catch (err) {
    console.error("Error saving registration:", err);
    res.status(400).json({ error: err.message });
  }
});

/* ==============================
   LOGIN ROUTE
============================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationDate: user.registrationDate
          ? user.registrationDate.toDateString()
          : "N/A",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

/* ==============================
   PROFILE ROUTE
============================== */
app.get("/profile", async (req, res) => {
  try {
    const user = await Register.findOne();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      registrationDate: user.registrationDate
        ? user.registrationDate.toDateString()
        : "N/A",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   VACCINATION SCHEDULE ROUTE
============================== */
app.post("/api/schedule", async (req, res) => {
  const { dob, email } = req.body;

  try {
    const birthDate = new Date(dob);

    const addMonths = (months) => {
      const date = new Date(birthDate);
      date.setMonth(date.getMonth() + months);
      return date;
    };

    const schedule = [
      // Birth
      { vaccine: "BCG", dueDate: addMonths(0) },
      { vaccine: "OPV-0", dueDate: addMonths(0) },
      { vaccine: "Hepatitis B-1", dueDate: addMonths(0) },

      // 6 Weeks (~1.5 months)
      { vaccine: "DPT-1", dueDate: addMonths(1.5) },
      { vaccine: "OPV-1", dueDate: addMonths(1.5) },
      { vaccine: "Hib-1", dueDate: addMonths(1.5) },
      { vaccine: "Hepatitis B-2", dueDate: addMonths(1.5) },

      // 10 Weeks (~2.5 months)
      { vaccine: "DPT-2", dueDate: addMonths(2.5) },
      { vaccine: "OPV-2", dueDate: addMonths(2.5) },
      { vaccine: "Hib-2", dueDate: addMonths(2.5) },

      // 14 Weeks (~3.5 months)
      { vaccine: "DPT-3", dueDate: addMonths(3.5) },
      { vaccine: "OPV-3", dueDate: addMonths(3.5) },
      { vaccine: "Hib-3", dueDate: addMonths(3.5) },

      // 6 Months
      { vaccine: "Hepatitis B-3", dueDate: addMonths(6) },

      // 9 Months
      { vaccine: "Measles-1", dueDate: addMonths(9) },

      // 12 Months
      { vaccine: "MMR", dueDate: addMonths(12) },

      // 18 Months
      { vaccine: "DPT Booster", dueDate: addMonths(18) },
      { vaccine: "OPV Booster", dueDate: addMonths(18) },

      // 2 Years
      { vaccine: "Typhoid", dueDate: addMonths(24) },

      // 5 Years
      { vaccine: "DPT Booster (5 Years)", dueDate: addMonths(60) },
    ];

    // Save to MongoDB
    for (let item of schedule) {
      await Vaccination.create({
        vaccine: item.vaccine,
        dueDate: item.dueDate,
        email: email,
      });
    }

    res.status(200).json({ schedule });
  } catch (error) {
    console.error("Error generating schedule:", error);
    res.status(500).json({ message: "Error generating schedule" });
  }
});

/* ==============================
   START SERVER
============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
