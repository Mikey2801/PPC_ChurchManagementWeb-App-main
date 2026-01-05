import React, { useState } from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'About Us', path: '/about-us' },
    { text: 'Our Team', path: '/our-team' },
    { text: 'Our Program', path: '/our-program' },
    { text: 'Events', path: '/events' },
    { text: 'Visit Us', path: '/visit-us' },
    { text: 'Login', path: '/login' },
    { text: 'Donate', path: '/donate', highlight: true },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Box>
      <IconButton 
        onClick={() => setIsOpen(!isOpen)} 
        sx={{ 
          width: 40, 
          height: 40,
          color: '#3C6255',
          '&:hover': {
            bgcolor: 'rgba(104, 185, 132, 0.1)',
          }
        }}
      >
        <Box 
          className="burger-inner header-menu-icon-doubleLineHamburger"
          sx={{
            width: 24,
            height: 20,
            position: 'relative',
            '& > div': {
              position: 'absolute',
              width: '100%',
              height: 2,
              bgcolor: '#3C6255',
              transition: 'all 0.3s ease',
            },
            '& .top-bun': {
              top: isOpen ? '50%' : 0,
              transform: isOpen ? 'rotate(45deg)' : 'none',
            },
            '& .patty': {
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: isOpen ? 0 : 1,
            },
            '& .bottom-bun': {
              bottom: isOpen ? '40%' : 0,
              transform: isOpen ? 'rotate(-45deg)' : 'none',
            }
          }}
        >
          <div className="top-bun" />
          <div className="patty" />
          <div className="bottom-bun" />
        </Box>
      </IconButton>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 300,
            bgcolor: 'white',
            boxShadow: 3
          }
        }}
      >
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 2,
                cursor: 'pointer',
                bgcolor: item.highlight ? 'rgba(104, 185, 132, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: item.highlight 
                    ? 'rgba(104, 185, 132, 0.2)' 
                    : 'rgba(104, 185, 132, 0.1)',
                }
              }}
            >
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    color: '#3C6255',
                    fontWeight: item.highlight ? 'bold' : 'medium',
                    fontSize: '1.1rem',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default NavMenu; 