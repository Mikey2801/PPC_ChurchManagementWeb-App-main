import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import Image2 from '../assets/Image2.png';
import ProgramCard from '../components/ProgramCard/ProgramCard';
import programs from '../data/programs';

const OurProgram = () => {
  const theme = useTheme();
  
  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        component="section"
        aria-labelledby="programs-heading"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          borderBottomRightRadius: { xs: '20%', md: '30%' },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h1" 
            id="programs-heading"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Our Programs
          </Typography>
          <Typography 
            variant="h2"
            component="p"
            sx={{
              maxWidth: 800,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            From dynamic youth groups to enriching adult studies, there's something for everyone to deepen their connection with God and each other. Join us as we navigate life's path together, guided by faith and fellowship.
          </Typography>
        </Container>
      </Box>

      {/* Programs Grid */}
      <Container 
        maxWidth="lg" 
        component="section"
        aria-label="Programs list"
        sx={{ 
          mt: { xs: -3, sm: -4, md: -6 },
          mb: { xs: 6, md: 8 },
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {programs.map((program) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={4} 
              key={program.id}
              sx={{
                display: 'flex',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <ProgramCard program={program} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom Image Section */}
      <Box
        component="section"
        aria-label="Church community"
        sx={{
          width: '100%',
          height: { xs: '300px', sm: '350px', md: '400px' },
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${Image2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          mt: { xs: 6, md: 8 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 2,
            px: { xs: 3, sm: 4 },
          }}
        >
          <Typography 
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Join Our Community
          </Typography>
          <Typography 
            variant="h3"
            component="p"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: 800,
              mb: 3,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              opacity: 0.9,
            }}
          >
            Be part of our growing family and experience God's love in our community.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default OurProgram;