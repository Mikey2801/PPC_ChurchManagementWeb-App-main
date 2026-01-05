import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled Components
const DonationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const DonationAmountButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '100px',
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light + '33' : 'transparent',
  color: selected ? theme.palette.primary.dark : theme.palette.text.primary,
  fontWeight: selected ? 600 : 400,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '33',
  },
}));

const Donate = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    category: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    isAnonymous: false,
    paymentMethod: 'gcash',
    receipt: null,
  });
  const [confirmation, setConfirmation] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);

  const presetAmounts = [100, 500, 1000, 2000, 5000];
  const donationCategories = [
    { value: 'tithes', label: 'Tithes' },
    { value: 'offerings', label: 'Offerings' },
    { value: 'special', label: 'Special Contributions' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, receipt: files[0] }));
      setReceiptPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: amount === 'other' ? '' : prev.customAmount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send formData to the server or backend
    setConfirmation(true);
    setTimeout(() => {
      setConfirmation(false);
      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard');
      }
    }, 2000);
  };

  if (confirmation) {
    return (
      <Box sx={{ py: 8, minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
            Thank You for Your Donation!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your donation details have been submitted for administrator verification. You will receive a confirmation once your donation is verified.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>Back to Home</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 8,
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.dark,
              mb: 2
            }}
          >
            Support Our Mission
          </Typography>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            maxWidth="800px" 
            mx="auto"
            sx={{ mb: 4 }}
          >
            Your generous donation helps us continue our mission and serve our community. 
            Every contribution makes a difference.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Donation Form */}
          <Grid item xs={12} md={8}>
            <DonationCard>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Donation Category */}
                <Box mb={4}>
                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Donation Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formData.category}
                      label="Donation Category"
                      onChange={handleInputChange}
                    >
                      {donationCategories.map(cat => (
                        <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  Make a Donation
                </Typography>
                
                {/* Donation Amount */}
                <Box mb={4}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Select Amount (PHP)
                  </Typography>
                  <Box display="flex" flexWrap="wrap" mb={2}>
                    {presetAmounts.map((amount) => (
                      <DonationAmountButton
                        key={amount}
                        variant="outlined"
                        selected={formData.amount === amount.toString()}
                        onClick={() => handleAmountSelect(amount.toString())}
                        type="button"
                      >
                        ₱{amount.toLocaleString()}
                      </DonationAmountButton>
                    ))}
                    <DonationAmountButton
                      variant="outlined"
                      selected={formData.amount === 'other'}
                      onClick={() => handleAmountSelect('other')}
                      type="button"
                    >
                      Other
                    </DonationAmountButton>
                  </Box>
                  
                  {(formData.amount === 'other' || !formData.amount) && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Enter custom amount"
                      type="number"
                      name="customAmount"
                      value={formData.customAmount}
                      onChange={handleInputChange}
                      required={formData.amount === 'other'}
                      InputProps={{
                        startAdornment: '₱',
                      }}
                      sx={{ maxWidth: '300px' }}
                    />
                  )}
                </Box>


                {/* Donor Information */}
                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                  Your Information
                </Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message (Optional)"
                      name="message"
                      multiline
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Add a personal message or dedication..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isAnonymous}
                          onChange={handleInputChange}
                          name="isAnonymous"
                          color="primary"
                        />
                      }
                      label="I would like to make this donation anonymously"
                    />
                  </Grid>
                </Grid>

                {/* Payment Method */}
                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                  Payment Method
                </Typography>
                <Box mb={4}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="payment-method-label">Select Payment Method</InputLabel>
                    <Select
                      labelId="payment-method-label"
                      id="payment-method"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      label="Select Payment Method"
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="gcash">GCash</MenuItem>
                      <MenuItem value="credit_card">Credit/Debit Card</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Payment Method Instructions */}
                  {formData.paymentMethod === 'gcash' && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Send your donation to GCash number: <strong>0912 345 6789</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Please include your name in the reference/message.
                      </Typography>
                    </Box>
                  )}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Bank: <strong>BDO</strong><br/>
                        Account Name: <strong>Pamukid Presbyterian Church</strong><br/>
                        Account Number: <strong>1234-5678-90</strong>
                      </Typography>
                    </Box>
                  )}
                  {formData.paymentMethod === 'paypal' && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        PayPal: <strong>paypal.me/pamukidchurch</strong>
                      </Typography>
                    </Box>
                  )}
                  {formData.paymentMethod === 'credit_card' && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Please use our PayPal link for credit/debit card donations: <strong>paypal.me/pamukidchurch</strong>
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Receipt Upload */}
                <Box mb={4}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Upload Receipt
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mb: 1 }}
                  >
                    Upload Screenshot/Scanned Copy
                    <input
                      type="file"
                      name="receipt"
                      accept="image/*,application/pdf"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                  {receiptPreview && (
                    <Box mt={1}>
                      <Typography variant="body2">Preview:</Typography>
                      <img src={receiptPreview} alt="Receipt Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 8 }} />
                    </Box>
                  )}
                </Box>

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  sx={{
                    py: 1.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mt: 2,
                  }}
                >
                  Submit Donation
                </Button>
              </form>
            </DonationCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <DonationCard>
              <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Your Donation Matters
              </Typography>
              
              <Typography paragraph sx={{ mb: 3 }}>
                Your generous donation helps us continue our mission and make a positive impact in our community.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  How your donation helps:
                </Typography>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>Supports our community outreach programs</li>
                  <li style={{ marginBottom: '8px' }}>Maintains our church facilities</li>
                  <li style={{ marginBottom: '8px' }}>Funds educational initiatives</li>
                  <li style={{ marginBottom: '8px' }}>Helps those in need</li>
                </ul>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Need help or have questions?
              </Typography>
              <Typography paragraph sx={{ mb: 2 }}>
                Contact us at <strong>donations@pamukidchurch.org</strong> or call <strong>(+63) 123 456 7890</strong>
              </Typography>
              
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                All donations are tax-deductible. You will receive a receipt for your records.
              </Typography>
            </DonationCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Add a close button if used in modal
Donate.defaultProps = {
  onClose: null,
};

export default Donate;