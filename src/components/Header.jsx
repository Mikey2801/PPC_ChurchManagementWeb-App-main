import React from 'react';
import { Box, Container, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavMenu from './NavMenu';
import logo from '../assets/logo.png';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About Us', path: '/about-us' },
    { text: 'Our Team', path: '/our-team' },
    { text: 'Our Program', path: '/our-program' },
    { text: 'Events', path: '/events' },
    { text: 'Visit Us', path: '/visit-us' },
  ];

  return (
    <Box 
      component="header" 
      sx={{
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1000,
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        py: 1
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/* Left section with logo and burger menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && <NavMenu />}
            <Box 
              component={Link} 
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <img 
                src={logo} 
                alt="Pamukid Presbyterian Church Logo" 
                style={{ 
                  height: '40px',
                  width: 'auto'
                }} 
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1,
                  color: '#3C6255',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Pamukid Presbyterian Church
              </Typography>
            </Box>
          </Box>

          {/* Center navigation - only on desktop */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: '#3C6255',
                    '&:hover': {
                      bgcolor: 'rgba(104, 185, 132, 0.1)',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right section with Login and Donate buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: '#3C6255',
                borderColor: '#3C6255',
                '&:hover': {
                  borderColor: '#68B984',
                  bgcolor: 'rgba(104, 185, 132, 0.1)',
                }
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/donate')}
              sx={{
                bgcolor: '#68B984',
                color: 'white',
                '&:hover': {
                  bgcolor: '#3C6255',
                }
              }}
            >
              Donate
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header; 