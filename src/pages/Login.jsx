import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography, MenuItem, IconButton, InputAdornment, Paper, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Call login API
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update AuthContext state
        setUser(user);

        // Redirect based on user role
        if (user.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Handle login errors
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 4
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 2 }}>
              <img 
                src={logo}
                alt="Pamukid Presbyterian Church" 
                style={{ 
                  width: '120px',
                  height: 'auto'
                }}
              />
            </Box>

            {/* Login Header */}
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{
                color: '#333',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1
              }}
            >
              LOGIN
            </Typography>
          </Box>

          {/* Login Form */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Email Field */}
            <TextField
              fullWidth
              name="email"
              placeholder="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
              sx={{ 
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              size="small"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            {error && (
              <Alert severity="error" onClose={() => setError('')} sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mt: 1 }}>
                {successMessage}
              </Alert>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: '#4caf50',
                '&:hover': {
                  bgcolor: '#43a047'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            {/* Register Link */}
            <Box sx={{ 
              textAlign: 'center',
              mt: 2
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }
                }}
              >
                Don't have an account?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Register
                </a>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginScreen;