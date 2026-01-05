import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Place as PlaceIcon,
  Send as SendIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const ministryContacts = [
  {
    ministry: 'Music Team',
    leader: 'John Smith',
    email: 'music@pamukidchurch.org',
    phone: '+63 912 345 6789',
    schedule: 'Rehearsals: Saturday 2:00 PM - 4:00 PM',
    location: 'Church Music Room',
  },
  {
    ministry: 'Food Team',
    leader: 'Anna Cruz',
    email: 'food@pamukidchurch.org',
    phone: '+63 911 222 3333',
    schedule: 'Meetings: 2nd Sunday after service',
    location: 'Church Kitchen',
  },
  {
    ministry: 'Children Ministry',
    leader: 'Maria Santos',
    email: 'children@pamukidchurch.org',
    phone: '+63 934 567 8901',
    schedule: 'Sunday School: 9:00 AM - 10:30 AM',
    location: "Children's Hall",
  },
  {
    ministry: 'Youth Ministry',
    leader: 'Jane Doe',
    email: 'youth@pamukidchurch.org',
    phone: '+63 932 123 4567',
    schedule: 'Meetings: Friday 6:00 PM - 8:00 PM',
    location: 'Church Youth Room',
  },
  {
    ministry: 'Worship Team',
    leader: 'Bob Johnson',
    email: 'worship@pamukidchurch.org',
    phone: '+63 915 678 9012',
    schedule: 'Rehearsals: Thursday 7:00 PM - 9:00 PM',
    location: 'Church Sanctuary',
  },
];

export default function ApplicationMinistryContacts() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);

  const handleCopyContact = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopySuccess(true);
  };

  const handleOpenMessage = (ministry) => {
    setSelectedMinistry(ministry);
    setOpenDialog(true);
  };

  const handleCloseMessage = () => {
    setOpenDialog(false);
    setMessageForm({
      name: '',
      email: '',
      message: '',
    });
  };

  const handleMessageChange = (field) => (event) => {
    setMessageForm({
      ...messageForm,
      [field]: event.target.value,
    });
  };

  const handleSendMessage = () => {
    // Here you would typically send the message to your backend
    console.log('Sending message:', {
      to: selectedMinistry.email,
      ...messageForm,
    });
    
    setShowMessageSuccess(true);
    handleCloseMessage();
  };

  return (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
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
            <Typography variant="h4">Ministry Contacts</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard/ministry/apply')}
            >
              Back to Application
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Below are the contact details for each ministry. Feel free to reach out to the ministry
          leaders for more information about serving opportunities.
        </Typography>

        <Grid container spacing={3}>
          {ministryContacts.map((contact) => (
            <Grid item xs={12} md={6} key={contact.ministry}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">
                      {contact.ministry}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SendIcon />}
                      onClick={() => handleOpenMessage(contact)}
                    >
                      Message
                    </Button>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ministry Leader"
                        secondary={contact.leader}
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={contact.email}
                      />
                      <Tooltip title="Copy Email">
                        <IconButton
                          edge="end"
                          onClick={() => handleCopyContact(contact.email)}
                          size="small"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={contact.phone}
                      />
                      <Tooltip title="Copy Phone">
                        <IconButton
                          edge="end"
                          onClick={() => handleCopyContact(contact.phone)}
                          size="small"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Schedule"
                        secondary={contact.schedule}
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <PlaceIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={contact.location}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseMessage} maxWidth="sm" fullWidth>
        <DialogTitle>
          Message to {selectedMinistry?.ministry}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              required
              label="Your Name"
              value={messageForm.name}
              onChange={handleMessageChange('name')}
            />
            <TextField
              fullWidth
              required
              label="Your Email"
              type="email"
              value={messageForm.email}
              onChange={handleMessageChange('email')}
            />
            <TextField
              fullWidth
              required
              label="Message"
              multiline
              rows={4}
              value={messageForm.message}
              onChange={handleMessageChange('message')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessage}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!messageForm.name || !messageForm.email || !messageForm.message}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Contact information copied to clipboard!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showMessageSuccess}
        autoHideDuration={2000}
        onClose={() => setShowMessageSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 