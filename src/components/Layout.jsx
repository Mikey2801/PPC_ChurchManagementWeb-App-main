import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChurchIcon from '@mui/icons-material/Church';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Services', icon: <ChurchIcon />, path: '/dashboard/services' },
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Donate', icon: <CardGiftcardIcon />, path: '/donate' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setMobileOpen(false);
    }
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: 240, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={logo}
          alt="Church Logo" 
          style={{ width: 120, height: 'auto' }}
        />
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigation(item.path)}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(104, 185, 132, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#3C6255' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                sx: { color: '#3C6255' }
              }}
            />
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            '&:hover': {
              bgcolor: 'rgba(104, 185, 132, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#3C6255' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Log out"
            primaryTypographyProps={{
              sx: { color: '#3C6255' }
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: 'calc(100% - 240px)' },
          ml: { sm: '240px' },
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'white',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#3C6255', flexGrow: 1 }}>
            Pamukid Presbyterian Church
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              width: 240,
              bgcolor: 'white',
              borderRight: '1px solid rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              width: 240,
              bgcolor: 'white',
              borderRight: '1px solid rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: '64px',
          bgcolor: '#F5F5F5',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 