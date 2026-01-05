import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Send as SendIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function BaptismalCertificate() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    dateRequest: '',
    lastName: '',
    firstName: '',
    middleName: '',
    street: '',
    town: '',
    province: '',
    phone: '',
    purpose: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const requiredFields = {
      dateRequest: 'Date Request',
      lastName: 'Last Name',
      firstName: 'First Name',
      street: 'Street/Barangay',
      town: 'Town/City',
      province: 'Province',
      phone: 'Phone Number',
      purpose: 'Purpose',
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);
    if (missingFields.length > 0) {
      setErrors({ form: `Please fill in: ${missingFields.join(', ')}` });
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', my: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          BAPTISMAL CERTIFICATE
        </Typography>
        <Box sx={{ width: '100%', height: 6, bgcolor: '#e0e0e0', borderRadius: 2, mb: 3 }}>
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#4caf50' }} />
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Date Request"
            type="date"
            value={formData.dateRequest}
            onChange={handleChange('dateRequest')}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Personal Information
          </Typography>
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Middle Name"
            value={formData.middleName}
            onChange={handleChange('middleName')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Current Address
          </Typography>
          <TextField
            label="Street/Barangay"
            value={formData.street}
            onChange={handleChange('street')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Town/City"
            value={formData.town}
            onChange={handleChange('town')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Province"
            value={formData.province}
            onChange={handleChange('province')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Contacts
          </Typography>
          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange('phone')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Purpose
          </Typography>
          <TextField
            label="Purpose"
            value={formData.purpose}
            onChange={handleChange('purpose')}
            fullWidth
            sx={{ mb: 2 }}
          />
          {errors.form && (
            <Alert severity="error" sx={{ mb: 2 }}>{errors.form}</Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="success"
            endIcon={<SendIcon />}
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit Request
          </Button>
        </form>
        <Snackbar
          open={showSuccess}
          autoHideDuration={2000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">Request submitted! Pending verification.</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}