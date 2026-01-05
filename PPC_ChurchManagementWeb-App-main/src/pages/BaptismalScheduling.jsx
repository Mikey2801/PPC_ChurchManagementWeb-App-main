import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Snackbar, Alert, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const baptismEvents = [
  {
    name: 'Baptism Ceremony - October 2024',
    date: '2024-10-29',
    time: '10:00 AM',
    location: 'Main Sanctuary',
  },
  // Add more events as needed
];

export default function BaptismalScheduling() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      setErrorMsg('Please select a baptism event.');
      setShowError(true);
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', my: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Baptismal Scheduling
        </Typography>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Select Baptism Event"
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          >
            {baptismEvents.map((evt, idx) => (
              <MenuItem key={idx} value={evt.name}>
                {evt.name} — {evt.date} at {evt.time} ({evt.location})
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Register for Event
          </Button>
        </form>
        <Snackbar
          open={showSuccess}
          autoHideDuration={2000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">Registration submitted! Pending approval.</Alert>
        </Snackbar>
        <Snackbar
          open={showError}
          autoHideDuration={2000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled">{errorMsg}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
