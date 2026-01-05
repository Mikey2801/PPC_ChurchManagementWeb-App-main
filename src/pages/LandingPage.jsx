import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import homeBg from '../assets/Homebg.png';
import lowerBgHome from '../assets/LowerBgHome.png';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        minHeight: '90vh',
        background: `linear-gradient(135deg, rgba(104, 185, 132, 0.7) 0%, rgba(60, 98, 85, 0.7) 100%), url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Logo on the left */}
            <Grid item xs={12} md={5}>
              <Box 
                component="img" 
                src={logo} 
                alt="Pamukid Presbyterian Church Logo"
                sx={{
                  width: { xs: '280px', md: '400px' },
                  height: 'auto',
                  display: 'block',
                  margin: { xs: 'auto', md: '0' }
                }}
              />
            </Grid>

            {/* Welcome text and button on the right */}
            <Grid item xs={12} md={7} sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              pl: { md: 4 }
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h3" component="h1" sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  Welcome to,
                </Typography>
                <Typography variant="h2" sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  lineHeight: 1.2
                }}>
                  Pamukid Presbyterian Church
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: 'white',
                  mt: 2
                }}>
                  A Home for Worship, Growth, and Community
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'white',
                  fontStyle: 'italic',
                  mt: 1,
                  fontSize: '1.1rem'
                }}>
                  "Join us in faith, fellowship, and service. Experience God's love and connect with a family that cares."
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button 
                    variant="contained"
                    onClick={() => navigate('/visit-us')}
                    sx={{
                      bgcolor: '#fff',
                      color: '#68B984',
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                      }
                    }}
                  >
                    Join Us
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Service Times Section */}
      <Box sx={{ bgcolor: 'rgba(60, 98, 85, 0.9)', py: 4, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
            Join Us This Sunday
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Sunday Worship Service
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3C6255' }}>
                  9:00 AM
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Discover Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ 
          color: '#3C6255',
          mb: 6,
          textAlign: 'center',
          fontWeight: 'medium'
        }}>
          Discover More About Our Church
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              bgcolor: 'white',
              p: 4,
              borderRadius: 2,
              height: '100%',
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#3C6255', fontWeight: 'bold' }}>
                Programs
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Stay updated with our upcoming worship services, Bible studies, and community events.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/our-program')}
                sx={{ mt: 2 }}
              >
                Learn More →
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              bgcolor: 'white',
              p: 4,
              borderRadius: 2,
              height: '100%',
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#3C6255', fontWeight: 'bold' }}>
                Events
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Explore ministries for youth, families, and outreach opportunities.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/events')}
                sx={{ mt: 2 }}
              >
                Learn More →
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{
              bgcolor: 'white',
              p: 4,
              borderRadius: 2,
              height: '100%',
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#3C6255', fontWeight: 'bold' }}>
                Visit Us
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Find our location, service times, and frequently asked questions for new visitors.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/visit-us')}
                sx={{ mt: 2 }}
              >
                Learn More →
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Mission Statement */}
      <Box 
        sx={{
          bgcolor: '#f5f5f5',
          py: 8,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          '&:hover': {
            bgcolor: '#e8e8e8'
          }
        }}
        onClick={() => navigate('/about-us')}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ color: '#3C6255', mb: 4 }}>
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 4, fontStyle: 'italic' }}>
            "To share the love of Christ, grow in faith together, and serve our community with compassion."
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/about-us');
            }}
            sx={{ mt: 2 }}
          >
            Learn More About Us
          </Button>
        </Container>
      </Box>

      {/* Worship Service Banner */}
      <Box sx={{
        bgcolor: 'rgba(60, 98, 85, 0.9)',
        py: 6,
        textAlign: 'center',
        background: `linear-gradient(rgba(60, 98, 85, 0.6), rgba(60, 98, 85, 0.6)), url(${lowerBgHome})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2, position: 'relative', zIndex: 2 }}>
          Worship Service
        </Typography>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>
          Every Sundays at 9:00 AM
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage; 