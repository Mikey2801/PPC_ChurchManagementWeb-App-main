import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Container, 
  Button, 
  Divider,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(12, 2),
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const MapContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  minHeight: '400px',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  '& iframe': {
    width: '100%',
    height: '100%',
    border: 0,
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  minWidth: '40px',
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  borderRadius: '50%',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

export default function VisitUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2
            }}
          >
            VISIT US
          </Typography>
          <Typography 
            variant="h5" 
            component="p"
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              mb: 3
            }}
          >
            Pamukid Presbyterian Church, Pamukid, San Fernando, Camarines Sur, Bicol, Philippines
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            href="#contact-info"
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              },
            }}
          >
            Get Directions
          </Button>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" id="contact-info">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <ContactCard>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 3,
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '60px',
                      height: '4px',
                      backgroundColor: 'primary.main',
                      borderRadius: '2px',
                    }
                  }}
                >
                  Contact Information
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <LocationOnIcon sx={{ 
                      color: 'primary.main', 
                      fontSize: '2rem',
                      mr: 2,
                      mt: 0.5 
                    }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Our Location</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Pamukid Presbyterian Church
                        <br />
                        Pamukid, San Fernando
                        <br />
                        Camarines Sur, Bicol
                        <br />
                        Philippines
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <AccessTimeIcon sx={{ 
                      color: 'primary.main', 
                      fontSize: '2rem',
                      mr: 2,
                      mt: 0.5 
                    }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Service Times</Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 600 }}>Sunday:</Typography>
                        <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                          9:00 AM - Worship Service
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 600 }}>Sunday:</Typography>
                        <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                          10:30 AM - Sunday School
                        </Typography>
                      </Box>
                      <Box>
                        <Typography component="span" sx={{ fontWeight: 600 }}>Wednesday:</Typography>
                        <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                          7:00 PM - Prayer Meeting
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <PhoneIcon sx={{ 
                      color: 'primary.main', 
                      fontSize: '2rem',
                      mr: 2,
                      mt: 0.5 
                    }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Contact Us</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        +63 123 456 7890
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        info@pamukidchurch.org
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />
                
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Follow Us</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <SocialButton 
                      color="primary" 
                      variant="contained" 
                      aria-label="Facebook"
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon />
                    </SocialButton>
                    <SocialButton 
                      color="primary" 
                      variant="contained" 
                      aria-label="Instagram"
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </SocialButton>
                    <SocialButton 
                      color="primary" 
                      variant="contained" 
                      aria-label="YouTube"
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YouTubeIcon />
                    </SocialButton>
                  </Box>
                </Box>
              </Box>
            </ContactCard>
          </Grid>

          {/* Google Map */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
              Our Location on Map
            </Typography>
            <MapContainer>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.123456789012!2d123.456789!3d13.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA3JzI0LjQiTiAxMjPCsDI3JzI3LjgiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph" 
                loading="lazy" 
                title="Pamukid Presbyterian Church Location"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </MapContainer>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              href="https://www.google.com/maps/dir//Pamukid+Presbyterian+Church,+Pamukid,+San+Fernando,+Camarines+Sur"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Open in Google Maps
            </Button>
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 3 }}>
            How to Get Here
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  width: '60px', 
                  height: '60px', 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <LocationOnIcon sx={{ color: 'white', fontSize: '2rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>By Public Transport</Typography>
                <Typography variant="body1" color="text.secondary">
                  Take a jeepney or van to San Fernando and ask to be dropped off at Pamukid. The church is located near the main road.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  width: '60px', 
                  height: '60px', 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                    <circle cx="7.5" cy="14.5" r="1.5"/>
                    <circle cx="16.5" cy="14.5" r="1.5"/>
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>By Private Vehicle</Typography>
                <Typography variant="body1" color="text.secondary">
                  Ample parking space is available within the church premises for cars and motorcycles.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ 
                  width: '60px', 
                  height: '60px', 
                  bgcolor: 'primary.main', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Landmarks</Typography>
                <Typography variant="body1" color="text.secondary">
                  We're located near Pamukid National High School and the Barangay Hall, just along the national highway.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}