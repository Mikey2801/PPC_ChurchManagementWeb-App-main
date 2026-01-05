import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    streetBarangay: user?.streetBarangay || '',
    townCity: user?.townCity || '',
    province: user?.province || '',
    phone: user?.phone || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('..');
    }, 1500);
  };

  const renderSection = (title, fields) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>
      <Grid container spacing={3}>
        {fields.map(({ field, label, type = 'text', options }) => (
          <Grid item xs={12} sm={6} key={field}>
            {type === 'select' ? (
              <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                  value={formData[field]}
                  onChange={handleChange(field)}
                  label={label}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label={label}
                value={formData[field]}
                onChange={handleChange(field)}
                type={type}
                InputLabelProps={type === 'date' ? { shrink: true } : undefined}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ py: 3 }}>
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
          <Typography variant="h4">Edit Profile</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('..')}
              sx={{ 
                mr: 2,
                borderColor: 'grey.400',
                color: 'grey.700',
                '&:hover': {
                  borderColor: 'grey.600',
                  bgcolor: 'grey.50'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                px: 3
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>

      {renderSection('Personal Information', [
        { field: 'lastName', label: 'Last Name' },
        { field: 'firstName', label: 'First Name' },
        { field: 'middleName', label: 'Middle Name' },
        { field: 'birthDate', label: 'Birth Date', type: 'date' },
        {
          field: 'gender',
          label: 'Gender',
          type: 'select',
          options: ['Male', 'Female', 'Other'],
        },
      ])}

      {renderSection('Current Address', [
        { field: 'streetBarangay', label: 'Street/Barangay' },
        { field: 'townCity', label: 'Town/City' },
        { field: 'province', label: 'Province' },
      ])}

      {renderSection('Contact Information', [
        { field: 'phone', label: 'Phone Number', type: 'tel' },
        { field: 'email', label: 'Email Address', type: 'email' },
      ])}

      {renderSection('Account Information', [
        { field: 'username', label: 'Username' },
      ])}

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 