import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogContent } from '@mui/material';
import Calendar from '../components/Calendar/Calendar';
import { format } from 'date-fns';

const MassAndEventSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [confirmedAttendance, setConfirmedAttendance] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Example highlighted dates (you would typically get these from your backend)
  const highlightedDates = [
    new Date(2024, 0, 7), // January 7th
    new Date(2024, 0, 14), // January 14th
    new Date(2024, 1, 14), // February 14th
  ];

  // Example event details (you would get this from your backend based on the selected date)
  const getEventDetails = (date) => {
    if (!date) return null;
    
    // Example event data
    return {
      type: format(date, 'EEEE'),
      time: format(date, 'EEEE') === 'Sunday' ? '09:00 am - 10:00 am' : '05:00 pm - 08:00 pm',
      pastor: format(date, 'EEEE') === 'Sunday' ? 'Pastor Kirby ajero Preza' : undefined
    };
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date) => {
    setCurrentDate(date);
  };

  const handleAttend = () => {
    setConfirmedAttendance(selectedDate);
    setShowSuccessDialog(true);
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleSuccessOk = () => {
    setShowSuccessDialog(false);
  };

  const handleConfirmCancel = () => {
    setConfirmedAttendance(null);
    setShowCancelDialog(false);
  };

  const eventDetails = getEventDetails(selectedDate);

  return (
    <Box sx={{
      maxWidth: 420,
      mx: 'auto',
      my: 3,
      p: { xs: 1, sm: 2 },
      bgcolor: '#fff',
      borderRadius: 4,
      boxShadow: 1,
      minHeight: '95vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Typography variant="h5" align="center" sx={{ mt: 3, mb: 2, fontWeight: 700 }}>
        Mass and Event Schedule
      </Typography>
      <Box sx={{
        bgcolor: '#f4fdee',
        borderRadius: 4,
        p: 2,
        mb: 2,
        mx: 'auto',
        maxWidth: 390
      }}>
        <Calendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          highlightedDates={highlightedDates}
          onDateSelect={showSuccessDialog ? undefined : handleDateSelect}
          onMonthChange={showSuccessDialog ? undefined : handleMonthChange}
          disabled={showSuccessDialog || showCancelDialog}
        />
      </Box>

      {!selectedDate && (
        <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
          Tap on a <span style={{ color: '#6bac7e', fontWeight: 'bold' }}>highlighted</span> date to view the schedule
        </Typography>
      )}

      {selectedDate && eventDetails && (
        <Box
          sx={{
            bgcolor: '#f4fdee',
            borderRadius: 4,
            p: 2,
            mb: 2,
            mx: 'auto',
            maxWidth: 390,
            opacity: showSuccessDialog || showCancelDialog ? 0.6 : 1,
            pointerEvents: showSuccessDialog || showCancelDialog ? 'none' : 'auto',
            transition: 'opacity 0.2s'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {confirmedAttendance ? 'Attendance' : 'Event Schedule'}
          </Typography>
          <Box sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 2,
            mb: 1,
            textAlign: 'center',
            boxShadow: 0
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {eventDetails.type}
            </Typography>
            {eventDetails.pastor && (
              <Typography sx={{ mb: 1 }}>{eventDetails.pastor}</Typography>
            )}
            <Typography>{eventDetails.time}</Typography>
          </Box>
          {!confirmedAttendance ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#eaffb0',
                color: '#222',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '2px 2px 4px #dbeecb',
                mt: 1,
                mb: 1,
                fontSize: 18,
                px: 4
              }}
              fullWidth
              onClick={handleAttend}
              disabled={showSuccessDialog || showCancelDialog}
            >
              Attend
            </Button>
          ) : (
            <>
              <Typography align="center" sx={{ fontWeight: 700, mb: 2, mt: 1 }}>
                Attendance confirmed for Mass On
                <br />
                {format(confirmedAttendance, 'yyyy-MM-d')}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#bdbdbd',
                  color: '#fff',
                  borderRadius: 2,
                  mb: 1,
                  fontWeight: 700,
                  fontSize: 18
                }}
                onClick={handleCancel}
                fullWidth
                disabled={showSuccessDialog || showCancelDialog}
              >
                cancel
              </Button>
            </>
          )}
        </Box>
      )}

      <Button
        variant="contained"
        sx={{
          display: 'block',
          mx: 'auto',
          bgcolor: confirmedAttendance ? '#bdbdbd' : '#4caf50',
          color: '#fff',
          borderRadius: 2,
          mt: 2,
          fontWeight: 700,
          fontSize: 18,
          opacity: showSuccessDialog || showCancelDialog ? 0.7 : 1
        }}
        onClick={() => window.history.back()}
        disabled={showSuccessDialog || showCancelDialog}
      >
        Back
      </Button>

      {/* Attendance Confirmed Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleSuccessOk}
        PaperProps={{
          sx: {
            bgcolor: '#f4fdee',
            borderRadius: 4,
            minWidth: 320,
            textAlign: 'center',
            boxShadow: 3
          }
        }}
      >
        <DialogContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, mt: 2 }}>Attendance Confirmed!</Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#eaffb0',
              color: '#222',
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: '2px 2px 4px #dbeecb',
              px: 6,
              py: 1,
              fontSize: 18
            }}
            onClick={handleSuccessOk}
            fullWidth
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#f4fdee',
            borderRadius: 4,
            minWidth: 320,
            textAlign: 'center',
            boxShadow: 3
          }
        }}
      >
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, mt: 2 }}>Cancel Attendance?</Typography>
          <Box display="flex" gap={2} justifyContent="center" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#bdbdbd',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18,
                px: 4
              }}
              onClick={() => setShowCancelDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#eaffb0',
                color: '#222',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '2px 2px 4px #dbeecb',
                px: 6,
                fontSize: 18
              }}
              onClick={handleConfirmCancel}
            >
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MassAndEventSchedule;