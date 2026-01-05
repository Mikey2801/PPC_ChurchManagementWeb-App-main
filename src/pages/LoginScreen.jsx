import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography, MenuItem, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'Member',
    username: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    navigate('/dashboard');
  };

  return (
      <Box
        sx={{
        minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        bgcolor: 'background.default',
        py: 4
        }}
      >
      <Container maxWidth="sm">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <img 
              src={logo}
              alt="Pamukid Presbyterian Church" 
              style={{ 
                width: '150px',
                height: 'auto'
          }}
            />
          </Box>

          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 3
            }}
          >
            LOGIN
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              select
              fullWidth
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              variant="outlined"
              sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Administrative Pastor">Administrative Pastor</MenuItem>
            </TextField>

            <TextField
              fullWidth
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              sx={{ bgcolor: 'background.paper' }}
            />

            <TextField
              fullWidth
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ bgcolor: 'background.paper' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/register')}
              >
                Don't have an account? Register
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot your password?
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                mt: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Login
            </Button>
          </Box>
      </Box>
    </Container>
    </Box>
  );
};

export default LoginScreen; 