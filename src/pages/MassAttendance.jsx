import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogContent } from '@mui/material';
import { format, isSameDay } from 'date-fns';

// Utility
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const massSchedules = {
  [format(new Date(), 'yyyy-MM-dd')]: {
    title: 'Special Mass (Today)',
    time: '08:00 am - 09:00 am',
    pastor: 'Pastor Kirby Ajero Preza',
  },
  '2025-06-02': {
    title: 'Morning Mass',
    time: '09:00 am - 10:00 am',
    pastor: 'Pastor Kirby Ajero Preza',
  },
  '2025-06-08': {
    title: 'Church Event',
    time: '03:00 pm - 05:00 pm',
    pastor: 'Event Coordinator',
  },
};

export default function MassAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedAttendance, setConfirmedAttendance] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const highlightedDates = Object.keys(massSchedules).map(d => new Date(d));

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

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

  while (week.length > 0 && week.length < 7) week.push(null);
  if (week.length) weeks.push(week);

  const handleDateSelect = (date) => {
    if (highlightedDates.some(hd => isSameDay(hd, date))) {
      setSelectedDate(date);
      setConfirmedAttendance(null);
    }
  };

  const handleAttend = () => {
    setConfirmedAttendance(selectedDate);
    setShowSuccessDialog(true);
  };

  const handleConfirmCancel = () => {
    setConfirmedAttendance(null);
    setSelectedDate(null);
    setShowCancelDialog(false);
  };

  const getEventDetails = (date) => {
    if (!date) return null;
    return massSchedules[format(date, 'yyyy-MM-dd')] || {
      title: format(date, 'EEEE'),
      time: '09:00 am - 10:00 am',
      pastor: 'Pastor Kirby Ajero Preza',
    };
  };

  const eventDetails = selectedDate ? getEventDetails(selectedDate) : null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} mb={3}>
        Mass Attendance
      </Typography>

      {/* Calendar */}
      <Box sx={{ bgcolor: '#f4fdee', borderRadius: 3, p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            ◀
          </Button>
          <Typography variant="h6" fontWeight={700} mx={3}>
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            ▶
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <Typography key={day} align="center" fontWeight={600}>
              {day}
            </Typography>
          ))}
        </Box>

        {weeks.map((week, i) => (
          <Box key={i} display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1.5} mb={1}>
            {week.map((date, idx) => {
              const isHighlighted =
                date && highlightedDates.some(hd => isSameDay(hd, date));

              return (
                <Box
                  key={idx}
                  onClick={() => date && handleDateSelect(date)}
                  sx={{
                    height: 56,
                    lineHeight: '56px',
                    textAlign: 'center',
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: isHighlighted ? 700 : 500,
                    bgcolor: isHighlighted ? '#7ee75c' : '#fff',
                    color: date ? 'text.primary' : 'transparent',
                    cursor: date ? 'pointer' : 'default',
                  }}
                >
                  {date?.getDate()}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Attendance Details */}
      {selectedDate && !confirmedAttendance && eventDetails && (
        <Box sx={{ bgcolor: '#f4fdee', borderRadius: 2, p: 2, mt: 3 }}>
          <Typography align="center" variant="h6" fontWeight={600} mb={1}>
            Attendance Details
          </Typography>

          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography fontWeight={700}>
              {format(selectedDate, 'EEEE')}
            </Typography>
            {eventDetails.pastor && (
              <Typography>{eventDetails.pastor}</Typography>
            )}
            <Typography>{eventDetails.time}</Typography>
          </Box>

          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleAttend}>
            Attend
          </Button>
        </Box>
      )}

      {/* Confirmed Attendance */}
      {confirmedAttendance && eventDetails && (
        <Box sx={{ bgcolor: '#f4fdee', borderRadius: 2, p: 2, mt: 3 }}>
          <Typography align="center" fontWeight={600}>
            Attendance Confirmed
          </Typography>
          <Typography align="center">
            {format(confirmedAttendance, 'MMMM dd, yyyy')}
          </Typography>
          <Typography align="center" sx={{ fontStyle: 'italic', mb: 2 }}>
            {eventDetails.pastor}
          </Typography>

          <Button fullWidth variant="contained" color="secondary" onClick={() => setShowCancelDialog(true)}>
            Cancel Attendance
          </Button>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
  <DialogContent sx={{ textAlign: 'center' }}>
    <Typography variant="h6" mb={2}>Attendance Confirmed!</Typography>
    <Button fullWidth onClick={() => setShowSuccessDialog(false)}>OK</Button>
  </DialogContent>
</Dialog>

      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography mb={2}>Cancel attendance?</Typography>
          <Button onClick={handleConfirmCancel}>Yes</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}