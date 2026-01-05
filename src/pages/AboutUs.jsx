import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import LeafImage from '../assets/Leaf.png';

const AboutUs = () => {
  return (
    <Box>
      {/* Vision & Mission Section with curved bottom */}
      <Box
        sx={{
          bgcolor: '#68B984',
          color: 'white',
          pt: 15,
          pb: 20,
          position: 'relative',
          borderBottomLeftRadius: '50% 20%',
          borderBottomRightRadius: '50% 20%',
          mb: -10
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            {/* Vision */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', px: { xs: 2, md: 6 } }}>
                <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                  Vision
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.8 }}>
                  "We envision Proclaiming Christ to families in the community both in our words in actions. Preparing then to be spiritually mature members, and sending them to Participate in fulfilling Christ's great commission with integrity and in love."
                </Typography>
              </Box>
            </Grid>

            {/* Mission */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', px: { xs: 2, md: 6 } }}>
                <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                  Mission
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.8 }}>
                  "To empower and equip people to help fulfill the great commission through evangelism discipleship, and becoming an example of the true Christian faith in the community."
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Container maxWidth="lg" sx={{ mt: 15, mb: 8 }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 10,
            mx: 'auto',
            maxWidth: '80%',
            fontWeight: 'medium'
          }}
        >
          Core Values Pamukid Presbyterian Church subscribes to the proclamation of the gospel prepares the converts for Christian maturity and commissions them for G-D's work.
        </Typography>

        <Grid container spacing={6}>
          {/* Proclaim */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src={LeafImage}
                alt="Leaf Icon"
                sx={{ 
                  width: 80,
                  height: 80,
                  mb: 3,
                  objectFit: 'contain'
                }}
              />
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                PROCLAIM
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                we put value on the gospel presentation because it is the primary role of the church
              </Typography>
            </Box>
          </Grid>

          {/* Prepare */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src={LeafImage}
                alt="Leaf Icon"
                sx={{ 
                  width: 80,
                  height: 80,
                  mb: 3,
                  objectFit: 'contain'
                }}
              />
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                PREPARE
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                every member is a leader and discipleship are the venues to have a vibrant church.
              </Typography>
            </Box>
          </Grid>

          {/* Commission */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src={LeafImage}
                alt="Leaf Icon"
                sx={{ 
                  width: 80,
                  height: 80,
                  mb: 3,
                  objectFit: 'contain'
                }}
              />
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                COMMISISION
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                Christians are called to the salt and light deploying every member to the key sectors of the society are the main purpose of the church
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs; 