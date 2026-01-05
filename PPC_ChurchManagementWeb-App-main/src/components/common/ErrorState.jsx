import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorState = ({ 
  message = 'Something went wrong', 
  actionText = 'Try Again',
  onAction 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          fontSize: 48,
          color: 'error.main'
        }} 
      />
      <Typography 
        variant="h6" 
        color="text.primary"
        textAlign="center"
      >
        {message}
      </Typography>
      {onAction && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState; 