import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestPage = () => {
  return (
    <Box 
      sx={{ 
        p: 4,
        minHeight: '100vh',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h1" gutterBottom>
        Test Page
      </Typography>
      <Typography variant="h4" gutterBottom>
        If you can see this, the routing and styling are working!
      </Typography>
      <Button 
        variant="contained" 
        sx={{ 
          mt: 4,
          bgcolor: 'white',
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'grey.100'
          }
        }}
      >
        Test Button
      </Button>
    </Box>
  );
};

export default TestPage; 