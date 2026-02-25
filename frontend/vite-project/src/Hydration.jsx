import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Box, Typography } from '@mui/material';
import AddReminder from './AddReminder';
import ReminderList from './ReminderList';

function Hydration() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/reminders')
      .then(response => setReminders(response.data))
      .catch(error => console.error(error));
  }, []);

  const addReminder = (reminder) => {
    axios.post('http://localhost:5000/reminders', reminder)
      .then(response => setReminders([...reminders, response.data]))
      .catch(error => console.error(error));
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Hydration Reminders
        </Typography>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <AddReminder addReminder={addReminder} />
          <ReminderList reminders={reminders} />
        </Paper>
      </Box>
    </Container>
  );
}

export default Hydration;
