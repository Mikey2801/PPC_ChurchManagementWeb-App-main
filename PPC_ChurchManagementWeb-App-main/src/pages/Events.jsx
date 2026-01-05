import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Grid,
  IconButton
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    let dayCount = 1;
    for (let i = 0; i < rows * 7; i++) {
      const dayOfWeek = i % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      
      if (i >= firstDayOfMonth && dayCount <= daysInMonth) {
        const isSelected = selectedDate.getDate() === dayCount && 
                          selectedDate.getMonth() === currentDate.getMonth() && 
                          selectedDate.getFullYear() === currentDate.getFullYear();
        
        days.push(
          <Grid item xs key={`day-${i}`} sx={{ 
            aspectRatio: '1', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative'
          }}>
            <Box
              onClick={() => handleDateClick(dayCount)}
              sx={{
                width: '36px',
                height: '36px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#6bac7e' : 'transparent',
                color: isSelected ? 'white' : isWeekend ? '#999' : 'inherit',
                fontSize: '0.9rem',
                fontWeight: isSelected ? 'bold' : 'normal',
                '&:hover': {
                  backgroundColor: isSelected ? '#5a9b6e' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              {dayCount++}
            </Box>
          </Grid>
        );
      } else {
        days.push(<Grid item xs key={`empty-${i}`} />);
      }
    }

    return days;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        {/* Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          px: 1
        }}>
          <Typography variant="h6" component="h2" sx={{ 
            fontWeight: 'bold',
            color: '#333'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          <Box>
            <IconButton 
              onClick={handlePrevMonth} 
              size="small"
              sx={{ 
                mr: 1,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleNextMonth}
              size="small"
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Week Days */}
        <Grid container spacing={0} sx={{ mb: 1, textAlign: 'center' }}>
          {weekDays.map((day, index) => (
            <Grid item xs key={day} sx={{ py: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: index === 0 ? '#f44336' : '#666',
                  fontWeight: 'medium',
                  display: 'block',
                  fontSize: '0.8rem'
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={0} columns={7} sx={{ minHeight: '240px' }}>
          {renderCalendarDays()}
        </Grid>

        {/* Selected Date Info */}
        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No events scheduled
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Events;