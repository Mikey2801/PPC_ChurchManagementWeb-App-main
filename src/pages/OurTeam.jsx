import React from 'react';
import { Box, Container, Typography, Grid, Avatar } from '@mui/material';
import PastorKirby from '../assets/OurTeam/Pastor Kirby Preza.jpg';
import NicoRelunia from '../assets/OurTeam/Nico Relunia.jpg';
import MarkMurillo from '../assets/OurTeam/Mark Murillo.jpg';
import JenniferPreza from '../assets/OurTeam/Jennifer Preza.jpg';
import DalynAlcomendas from '../assets/OurTeam/Dalyn Alcomendas.jpg';

const teamMembers = [
  {
    name: 'Rev. Je young Jung',
    role: 'CHURCH MODERATOR',
    description: 'To overseer the church and the Pastor.',
    image: null
  },
  {
    name: 'Pastor Kirby Preza',
    role: 'SENIOR PASTOR',
    description: 'Providing spiritual leadership and  give spiritual food and pray for people.',
    image: PastorKirby
  },
  {
    name: 'Deaconess Dalyn Alcomendas',
    role: 'TREASURER',
    description: 'Responsible for managing church finances and stewardship.',
    image: DalynAlcomendas
  },
  {
    name: 'Deacon Nico Relunia',
    role: 'MUSIC DIRECTOR',
    description: 'Leading our worship team and music ministry.',
    image: NicoRelunia
  },
  {
    name: 'Mrs. Jennifer Preza',
    role: 'KIDS MINISTRY LEADER',
    description: 'Nurturing the faith of our youngest members.',
    image: JenniferPreza
  },
  {
    name: 'Deacon Mark Murillo',
    role: 'BIBLE STUDY LEADER',
    description: 'Guiding our congregation in biblical teachings and discussions.',
    image: MarkMurillo
  }
];

const OurTeam = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom align="center">
          Our Team
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={member.image || ''}
                  alt={member.name}
                  sx={{
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'grey.200',
                    objectFit: 'cover'
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  {member.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: 'text.secondary', fontWeight: 'bold' }}
                >
                  {member.role}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {member.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OurTeam; 