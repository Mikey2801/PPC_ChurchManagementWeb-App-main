import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  Church as ChurchIcon,
  Article as ArticleIcon,
  CardGiftcard as DonateIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Donate from './Donate';
import BaptismalClass from './BaptismalClass';

// Modal wrapper for Donate
function DonateModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 2, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Donate />
      </Box>
    </Dialog>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [donateOpen, setDonateOpen] = useState(false);
  const [baptismalClassOpen, setBaptismalClassOpen] = useState(false);

  const services = [
    {
      title: 'Mass and Events Schedule',
      description: 'Join us for Sunday worship and Fun events!',
      icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/mass-attendance',
      color: theme.palette.primary.light
    },
    {
      title: 'Apply for Ministry',
      description: 'Ready to Serve? Answer Your Calling with Our Ministry Program!',
      icon: <ChurchIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/ministry/apply',
      color: theme.palette.primary.light
    },
    {
      title: 'Baptismal',
      description: 'Ready to take the plunge? Sign up for our baptism class and dive into a meaningful journey of faith.',
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/baptismal-certificate',
      color: theme.palette.primary.light
    },
    {
      title: 'Donate',
      description: 'Support our church\'s mission through your generous donations.',
      icon: <DonateIcon sx={{ fontSize: 40 }} />,
      modal: true,
      color: theme.palette.primary.light
    }
  ];

  const handleServiceClick = (service) => {
    if (service.modal) {
      setDonateOpen(true);
    } else {
      navigate(service.path);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <img 
          src={logo}
          alt="Pamukid Presbyterian Church"
          style={{
            width: '150px',
            height: 'auto',
            marginBottom: '24px'
          }}
        />
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2,
            color: 'text.primary',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Church Services
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: '600px'
          }}
        >
          Access various church services and participate in our community activities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.title}>
            <Card 
              onClick={() => handleServiceClick(service)}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
                backgroundColor: service.color
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                {service.icon}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ flexGrow: 1 }}>
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {/* Baptismal Class Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => setBaptismalClassOpen(true)}
            sx={{
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 6,
              },
              backgroundColor: theme.palette.primary.light
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <ArticleIcon sx={{ fontSize: 40 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1, color: 'text.primary' }}>
                Baptismal Class
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ flexGrow: 1 }}>
                Request and schedule a baptism class.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Mass Schedule
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sunday Mass
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  8:00 AM - 9:30 AM
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  10:00 AM - 11:30 AM
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4:00 PM - 5:30 PM
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Weekday Mass
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Monday - Friday
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  6:00 AM - 7:00 AM
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  6:00 PM - 7:00 PM
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
          {/* Donate Modal */}
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      {/* Inline Baptismal Class */}
      {baptismalClassOpen && (
        <Box sx={{ maxWidth: 420, mx: 'auto', my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={() => setBaptismalClassOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <BaptismalClass onClose={() => setBaptismalClassOpen(false)} />
        </Box>
      )}
    </Box>
  );
}

// Modal wrapper for Donate

