import React from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const Calendar = ({ currentDate, selectedDate, highlightedDates = [], onDateSelect, onMonthChange }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  return (
    <Box sx={{ 
      bgcolor: '#f8fff9',
      borderRadius: 4,
      p: 3,
      width: '100%',
      maxWidth: 400,
      mx: 'auto'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 2
      }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2, fontWeight: 'medium' }}>
          {format(currentDate, 'MMMM')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {/* Days of week headers */}
        {daysOfWeek.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography 
              variant="caption" 
              align="center" 
              sx={{ 
                display: 'block',
                color: 'text.secondary',
                mb: 1
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {/* Calendar days */}
        {getDaysInMonth().map((date) => {
          const isHighlighted = highlightedDates.some(d => isSameDay(new Date(d), date));
          const isSelected = selectedDate && isSameDay(new Date(selectedDate), date);

          return (
            <Grid item xs={12/7} key={date.toString()}>
              <Box
                onClick={() => onDateSelect(date)}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: isSelected ? '#6bac7e' : isHighlighted ? '#a7d5b4' : 'transparent',
                  '&:hover': {
                    bgcolor: isSelected ? '#6bac7e' : '#e0f2e4',
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isSelected ? 'white' : 'text.primary',
                    fontWeight: isHighlighted || isSelected ? 'bold' : 'regular'
                  }}
                >
                  {format(date, 'd')}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Calendar; 