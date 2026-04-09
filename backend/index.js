require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const schedule = require("node-schedule");
const axios = require("axios");

const Register = require("./models/Register");
const Vaccination = require("./models/Vaccination");
const exerciseRoutes = require('./routes/exerciseRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/exercise', exerciseRoutes);

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
    mobileNo: formData.mobileNo,
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
   FAST2SMS — Exercise Reminder
   Sends SMS to one mobile number
============================== */
async function sendExerciseSMS(mobileNo, userName) {
  const message =
    `Hi ${userName}! 🌸 It's your 5PM exercise reminder from NestCare+. ` +
    `Your daily postpartum exercises are ready. Stay consistent — every rep counts! 💪 Open the app and start your session now.`;

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',          // Quick / Transactional route — no DLT needed for testing
        message,
        language: 'english',
        flash: 0,
        numbers: String(mobileNo),
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ SMS sent to ${mobileNo} (${userName}):`, response.data?.message);
  } catch (err) {
    console.error(
      `❌ SMS failed for ${mobileNo} (${userName}):`,
      err.response?.data || err.message
    );
  }
}

/* ==============================
   SCHEDULER — Daily 5 PM IST
   Cron: second minute hour ...
   "0 0 17 * * *" = every day at 17:00:00
============================== */
schedule.scheduleJob('0 0 22 * * *', async () => {
  console.log('⏰ [SMS Scheduler] Running daily 10 PM exercise reminder...');

  try {
    // Fetch only users who have a valid mobileNo stored
    const users = await Register.find(
      { mobileNo: { $exists: true, $ne: null, $type: 'number' } },
      'name mobileNo'
    );

    console.log(`📋 Found ${users.length} user(s) with a mobile number.`);

    for (const user of users) {
      if (user.mobileNo && String(user.mobileNo).trim().length >= 10) {
        await sendExerciseSMS(user.mobileNo, user.name || 'Mama');
      } else {
        console.log(`⚠️  Skipping ${user.name} — invalid/missing mobile number.`);
      }
    }

    console.log('✅ [SMS Scheduler] All reminders processed.');
  } catch (err) {
    console.error('❌ [SMS Scheduler] Error fetching users:', err.message);
  }
});

console.log('📅 Exercise reminder scheduler armed — fires daily at 5:00 PM IST.');

/* ==============================
   START SERVER
============================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
