import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();

  const renderSection = (title, fields) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>
      <Grid container spacing={2}>
        {fields.map(([label, value]) => (
          <Grid item xs={12} sm={6} key={label}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body1">{value || '-'}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="h4">Profile Information</Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate('edit')}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              px: 3
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {renderSection('Personal Information', [
        ['Last Name', user?.lastName],
        ['First Name', user?.firstName],
        ['Middle Name', user?.middleName],
        ['Birth Date', user?.birthDate],
        ['Gender', user?.gender],
      ])}

      {renderSection('Current Address', [
        ['Street/Barangay', user?.streetBarangay],
        ['Town/City', user?.townCity],
        ['Province', user?.province],
      ])}

      {renderSection('Contact Information', [
        ['Phone Number', user?.phone],
        ['Email Address', user?.email],
      ])}

      {renderSection('Account Information', [
        ['Username', user?.username],
        ['Role', user?.role],
      ])}
    </Box>
  );
} 