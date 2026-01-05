import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const ProgramCard = ({ program }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 3,
        },
      }}
      elevation={2}
      component="article"
      aria-labelledby={`${program.id}-title`}
    >
      <Box
        sx={{
          width: '100%',
          height: 200,
          bgcolor: 'grey.200',
          mb: 2,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: program.image ? `url(${program.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          },
          '&:hover::after': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        }}
        aria-hidden="true"
      >
        {!program.image && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'text.secondary',
              textAlign: 'center',
              width: '100%',
              px: 2,
            }}
          >
            <Typography variant="body2">No Image Available</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          id={`${program.id}-title`}
          variant="h5" 
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {program.title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ 
              color: 'text.primary',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <span aria-hidden="true">📅</span>
            <span>{program.schedule}</span>
            {program.time && (
              <>
                <span aria-hidden="true">•</span>
                <span>{program.time}</span>
              </>
            )}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            flex: 1,
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {program.description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProgramCard;
