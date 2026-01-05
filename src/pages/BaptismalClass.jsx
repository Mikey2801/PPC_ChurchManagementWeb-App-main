// BaptismalClass.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Divider, Snackbar, Alert, 
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, 
  DialogActions, List, ListItem, ListItemText, Chip, IconButton 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Mock data - in a real app, this would come from an API
const mockClassSchedules = [
  {
    id: 1,
    name: 'Baptism Preparation Session - October 2024',
    date: '2024-10-20',
    time: '2:00 PM',
    venue: 'Church Hall',
    maxParticipants: 20,
    currentParticipants: 8
  },
  {
    id: 2,
    name: 'Baptism Preparation Session - November 2024',
    date: '2024-11-17',
    time: '2:00 PM',
    venue: 'Church Hall',
    maxParticipants: 20,
    currentParticipants: 15
  }
];

// Mock user data - in a real app, this would come from authentication
const mockUser = {
  id: 'user123',
  name: 'Jane Doe',
  role: 'member' // or 'admin'
};

// Mock requests storage - in a real app, this would be in a database
let mockRequests = [
  {
    id: 'req1',
    userId: 'user123',
    classId: 1,
    status: 'pending', // 'pending', 'approved', 'rejected'
    requestDate: '2024-06-01',
    processedBy: null,
    processedDate: null,
    rejectionReason: null
  }
];

export default function BaptismalClass() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [classSchedules, setClassSchedules] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load data on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setClassSchedules(mockClassSchedules);
    const userReqs = mockRequests.filter(req => req.userId === mockUser.id);
    setUserRequests(userReqs);
    
    if (mockUser.role === 'admin') {
      setPendingRequests(mockRequests.filter(req => req.status === 'pending'));
      if (pendingRequests.length > 0) {
        setNotification({
          message: `You have ${pendingRequests.length} pending baptism class requests`,
          type: 'info'
        });
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass) {
      setErrorMsg('Please select a class schedule.');
      setShowError(true);
      return;
    }

    // In a real app, this would be an API call
    const newRequest = {
      id: `req${Date.now()}`,
      userId: mockUser.id,
      classId: selectedClass,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      processedBy: null,
      processedDate: null,
      rejectionReason: null
    };

    mockRequests.push(newRequest);
    setUserRequests([...userRequests, newRequest]);
    setShowSuccess(true);
  };

  const handleAdminAction = (requestId, action, reason = '') => {
    // In a real app, this would be an API call
    const requestIndex = mockRequests.findIndex(req => req.id === requestId);
    if (requestIndex !== -1) {
      mockRequests[requestIndex] = {
        ...mockRequests[requestIndex],
        status: action,
        processedBy: mockUser.id,
        processedDate: new Date().toISOString().split('T')[0],
        rejectionReason: action === 'rejected' ? reason : null
      };

      setPendingRequests(mockRequests.filter(req => req.status === 'pending'));
      setNotification({
        message: `Request ${action} successfully`,
        type: 'success'
      });
    }
  };

  const getClassById = (id) => classSchedules.find(cls => cls.id === id);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      {/* Admin Notification Badge */}
      {mockUser.role === 'admin' && pendingRequests.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<NotificationsActiveIcon />}
          onClick={() => setShowAdminDialog(true)}
          sx={{ mb: 2 }}
        >
          {pendingRequests.length} Pending Requests
        </Button>
      )}

      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Baptismal Class Registration
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        {/* User's Current Requests */}
        {userRequests.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Your Requests</Typography>
            <List>
              {userRequests.map((req) => {
                const cls = getClassById(req.classId);
                return (
                  <ListItem key={req.id} divider>
                    <ListItemText
                      primary={`${cls?.name || 'Class'}`}
                      secondary={`Status: ${req.status.toUpperCase()} - Requested on ${req.requestDate}`}
                    />
                    {req.status === 'rejected' && req.rejectionReason && (
                      <Chip 
                        label={`Rejected: ${req.rejectionReason}`} 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Select Class Schedule"
            value={selectedClass}
            onChange={e => setSelectedClass(Number(e.target.value))}
            fullWidth
            sx={{ mb: 3 }}
            disabled={userRequests.some(req => ['pending', 'approved'].includes(req.status))}
          >
            {classSchedules.map((cls) => (
              <MenuItem 
                key={cls.id} 
                value={cls.id}
                disabled={cls.currentParticipants >= cls.maxParticipants}
              >
                {cls.name} — {format(new Date(cls.date), 'MMMM d, yyyy')} at {cls.time} 
                ({cls.venue}) - {cls.currentParticipants}/{cls.maxParticipants} participants
              </MenuItem>
            ))}
          </TextField>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={userRequests.some(req => ['pending', 'approved'].includes(req.status))}
          >
            {userRequests.some(req => req.status === 'pending') 
              ? 'Request Pending' 
              : userRequests.some(req => req.status === 'approved') 
                ? 'Registration Confirmed' 
                : 'Request Schedule'}
          </Button>
        </form>
      </Paper>

      {/* Admin Approval Dialog */}
      <Dialog 
        open={showAdminDialog} 
        onClose={() => setShowAdminDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pending Baptism Class Requests</DialogTitle>
        <DialogContent>
          <List>
            {pendingRequests.map((req) => {
              const cls = getClassById(req.classId);
              const user = { name: 'Member' }; // In a real app, fetch user details
              return (
                <ListItem key={req.id} divider>
                  <ListItemText
                    primary={`${user.name} - ${cls?.name || 'Class'}`}
                    secondary={`Requested on: ${req.requestDate}`}
                  />
                  <IconButton 
                    color="success" 
                    onClick={() => handleAdminAction(req.id, 'approved')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      const reason = prompt('Please enter reason for rejection:');
                      if (reason) handleAdminAction(req.id, 'rejected', reason);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAdminDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          Your request has been submitted and is pending approval.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setShowError(false)}>
          {errorMsg}
        </Alert>
      </Snackbar>

      {notification && (
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={notification.type} 
            variant="filled" 
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}