const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const bcrypt = require('bcryptjs'); // For password hashing
require('dotenv').config();

const Meal = require('./models/Meal');
const WaterReminder = require('./models/WaterReminder');
const Vaccination = require('./models/Vaccination');
const Register = require('./models/Register'); // Add this line

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/postnatal';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Meal Routes
app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/meals', async (req, res) => {
  const mealData = req.body;
  try {
    const newMeal = new Meal(mealData);
    await newMeal.save();
    res.status(201).send(newMeal);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Water Reminder Routes
app.get('/reminders', async (req, res) => {
  try {
    const reminders = await WaterReminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/reminders', async (req, res) => {
  const reminderData = req.body;
  try {
    const newReminder = new WaterReminder(reminderData);
    await newReminder.save();
    res.status(201).send(newReminder);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Vaccination Schedule Routes
app.post('/api/schedule', async (req, res) => {
  const { dob, email } = req.body;
  const dobDate = new Date(dob);
  const scheduleData = [
    { vaccine: 'BCG', dueDate: dobDate },
    { vaccine: 'Hepatitis B - Birth dose', dueDate: dobDate },
    { vaccine: 'OPV-0', dueDate: dobDate },
    { vaccine: 'OPV 1', dueDate: new Date(dobDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'OPV 2', dueDate: new Date(dobDate.getTime() + 10 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'OPV 3', dueDate: new Date(dobDate.getTime() + 14 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Pentavalent 1', dueDate: new Date(dobDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Pentavalent 2', dueDate: new Date(dobDate.getTime() + 10 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Pentavalent 3', dueDate: new Date(dobDate.getTime() + 14 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Rotavirus 1', dueDate: new Date(dobDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Rotavirus 2', dueDate: new Date(dobDate.getTime() + 10 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Rotavirus 3', dueDate: new Date(dobDate.getTime() + 14 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'IPV 1', dueDate: new Date(dobDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'IPV 2', dueDate: new Date(dobDate.getTime() + 14 * 7 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Measles /MR 1st Dose', dueDate: new Date(dobDate.getTime() + 9 * 30 * 24 * 60 * 60 * 1000) },
    { vaccine: 'JE - 1', dueDate: new Date(dobDate.getTime() + 9 * 30 * 24 * 60 * 60 * 1000) },
    { vaccine: 'Vitamin A (1st dose)', dueDate: new Date(dobDate.getTime() + 9 * 30 * 24 * 60 * 60 * 1000) },
  ];

  try {
    for (const vac of scheduleData) {
      const newVac = new Vaccination({ ...vac, email });
      await newVac.save();

      // Schedule email reminder
      schedule.scheduleJob(vac.dueDate, () => {
        sendEmailReminder(email, vac.vaccine, vac.dueDate);
      });
    }

    res.status(200).send({ schedule: scheduleData });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while saving the schedule.' });
  }
});

const sendEmailReminder = (email, vaccine, dueDate) => {
  const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525, // 2525 may not work for all services, try using 587 for TLS/SSL
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    maxConnections: 1
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Vaccination Reminder for ${vaccine}`,
    text: `This is a reminder that the ${vaccine} vaccination is due on ${dueDate.toDateString()}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Registration Route
app.post('/register', async (req, res) => {
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
    console.log('Saved data:', savedData);
    res.status(201).json(savedData);
  } catch (err) {
    console.error('Error saving registration:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid email' });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    // Successful login
    res.status(200).json({
      status: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationDate: user.registrationDate ? user.registrationDate.toDateString() : 'N/A',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// Profile Route
app.get('/profile', async (req, res) => {
  try {
    // Fetch user from the database
    const user = await Register.findOne(); // You might need to use a filter, e.g., user ID or session ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure email is defined before accessing it
    if (user.email) {
      res.json({
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Email is not available' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
