import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const pages = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'Our Team', path: '/team' },
    { title: 'Our Program', path: '/program' },
    { title: 'Events', path: '/events' },
    { title: 'Visit Us', path: '/visit' },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <img
              src={logo}
              alt="Pamukid Presbyterian Church"
              style={{
                height: '50px',
                width: 'auto',
                marginRight: '10px'
              }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                noWrap
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700
                }}
              >
                Pamukid Presbyterian Church
              </Typography>
            )}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={() => handleNavigate(page.path)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={() => handleNavigate('/login')}>
                <Typography textAlign="center" sx={{ color: theme.palette.primary.main }}>Login</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  color: theme.palette.primary.main,
                  display: 'block',
                  '&:hover': {
                    bgcolor: 'rgba(107,172,126,0.1)',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleNavigate('/login')}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                ml: 2,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: 'rgba(107,172,126,0.1)',
                }
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => handleNavigate('/donate')}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              Donate
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 