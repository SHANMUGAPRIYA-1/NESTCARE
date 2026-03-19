import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddReminder from "./AddReminder";
import ReminderList from "./ReminderList";

const API_URL = "http://localhost:5000/reminders";

function Hydration() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Reminders
  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(API_URL);
      setReminders(response.data);
    } catch (err) {
      setError("Failed to load reminders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Add Reminder
  const addReminder = async (reminder) => {
    try {
      const response = await axios.post(API_URL, reminder);

      // Functional update (professional pattern)
      setReminders((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Failed to add reminder.");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          💧 Hydration Reminders
        </Typography>

        <Paper elevation={3} sx={{ padding: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <AddReminder addReminder={addReminder} />

          {loading ? (
            <Box textAlign="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <ReminderList reminders={reminders} />
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Hydration;
