import React, { useState } from 'react';
// If you use date-fns, uncomment the import below:
// import { getDaysInMonth } from 'date-fns';
// Fallback utility if not using date-fns:
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

import { Box, Typography, Button, Paper, Grid, Snackbar, Alert, Dialog, DialogContent } from '@mui/material';
import { format, isSameDay } from 'date-fns';

const massSchedules = {
  [format(new Date(), 'yyyy-MM-dd')]: {
    title: 'Special Mass (Today)',
    time: '08:00 am - 09:00 am',
    speaker: 'Pastor Kirby Ajero Preza',
  },
  '2025-06-02': {
    title: 'Morning Mass',
    time: '09:00 am - 10:00 am',
    speaker: 'Pastor Kirby Ajero Preza',
  },
  '2025-06-08': {
    title: 'Church Event',
    time: '03:00 pm - 05:00 pm',
    speaker: 'Event Coordinator',
  },
};

const formatDate = (date) => format(date, 'yyyy-MM-dd');
const formatWeekday = (date) => format(date, 'EEEE');

export default function MassAttendance() {
  // Highlighted dates: dates with massSchedules
  const highlightedDates = Object.keys(massSchedules).map(dateStr => new Date(dateStr));



  // Handler for selecting a date
  const handleDateSelect = (date) => {
    if (highlightedDates.some(hd => isSameDay(hd, date))) {
      setSelectedDate(date);
      setConfirmedAttendance(null);
    }
  }
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedAttendance, setConfirmedAttendance] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Calendar logic
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const weeks = [];
  let week = [];
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };



  const handleAttend = () => {
    setConfirmedAttendance(selectedDate);
    setShowSuccessDialog(true);
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setConfirmedAttendance(null);
    setShowCancelDialog(false);
    setSelectedDate(null);
  };

  // Example event details
  const getEventDetails = (date) => {
    if (!date) return null;
    if (format(date, 'EEEE') === 'Sunday') {
      return {
        day: 'Sunday',
        pastor: 'Pastor Kirby ajero Preza',
        time: '09:00 am - 10:00 am',
      };
    }
    return {
      day: format(date, 'EEEE'),
      time: '05:00 pm - 08:00 pm',
    };
  };

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', my: 4, p: 2 }}>
      <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        Mass Attendance
      </Typography>
      <Box sx={{ bgcolor: '#f4fdee', borderRadius: 3, p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <Button onClick={handlePrevMonth} size="small">&#60;</Button>
          <Typography variant="subtitle1" sx={{ mx: 2 }}>
            {format(currentMonth, 'MMMM')}
          </Typography>
          <Button onClick={handleNextMonth} size="small">&#62;</Button>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={1}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Typography key={day} variant="body2" align="center" sx={{ color: 'grey.700' }}>{day}</Typography>
          ))}
        </Box>
        {weeks.map((week, i) => (
          <Box key={i} display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mb={0.5}>
            {week.map((date, idx) => (
              <Box
                key={idx}
                sx={{
                  height: 32,
                  bgcolor: date && highlightedDates.some(hd => isSameDay(hd, date)) ? '#7ee75c' : '#fff',
                  borderRadius: 1,
                  textAlign: 'center',
                  lineHeight: '32px',
                  color: date ? 'text.primary' : 'transparent',
                  fontWeight: date && highlightedDates.some(hd => isSameDay(hd, date)) ? 600 : 400,
                  cursor: date ? 'pointer' : 'default',
                }}
                onClick={() => date && handleDateSelect(date)}
              >
                {date ? date.getDate() : ''}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {selectedDate && !confirmedAttendance && (
        <Box sx={{ bgcolor: '#f4fdee', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>Attendance</Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, mt: 1, mb: 1 }}>
            <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>{getEventDetails(selectedDate).day}</Typography>
            {getEventDetails(selectedDate).pastor && (
              <Typography align="center">{getEventDetails(selectedDate).pastor}</Typography>
            )}
            <Typography align="center">{getEventDetails(selectedDate).time}</Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: '#d1e7c6', color: '#222', fontWeight: 700, borderRadius: 2, boxShadow: 2, mt: 1, mb: 1 }}
            onClick={handleAttend}
            fullWidth
          >
            Attend
          </Button>
        </Box>
      )}

      {confirmedAttendance && (
        <Box sx={{ bgcolor: '#f4fdee', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography align="center" variant="h6" sx={{ fontWeight: 600 }}>Attendance confirmed for Mass On</Typography>
          <Typography align="center" sx={{ fontWeight: 600, mb: 2 }}>{format(confirmedAttendance, 'yyyy-MM-d')}</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#bdbdbd', color: '#fff', borderRadius: 2, mb: 1 }}
            onClick={handleCancel}
            fullWidth
          >
            cancel
          </Button>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{ display: 'block', mx: 'auto', bgcolor: '#4caf50', color: '#fff', borderRadius: 2 }}
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
        <DialogContent sx={{ bgcolor: '#f4fdee', textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Attendance Confirmed!</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#d1e7c6', color: '#222', fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
            onClick={() => setShowSuccessDialog(false)}
            fullWidth
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogContent sx={{ bgcolor: '#f4fdee', textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Cancel Attendance?</Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              sx={{ bgcolor: '#bdbdbd', color: '#fff', borderRadius: 2 }}
              onClick={() => setShowCancelDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#d1e7c6', color: '#222', fontWeight: 700, borderRadius: 2, boxShadow: 2 }}
              onClick={handleConfirmCancel}
            >
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}