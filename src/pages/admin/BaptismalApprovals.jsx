import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Divider, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody, Stack } from '@mui/material';

// Mock data for demonstration
const initialRequests = [
  {
    id: 1,
    type: 'Baptismal Class',
    name: 'Juan Dela Cruz',
    schedule: 'Baptism Preparation Session - October 2024',
    status: 'Pending',
  },
  {
    id: 2,
    type: 'Baptismal Scheduling',
    name: 'Maria Santos',
    schedule: 'Baptism Ceremony - October 2024',
    status: 'Pending',
  },
];

export default function BaptismalApprovals() {
  const [requests, setRequests] = useState(initialRequests);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAction = (id, action) => {
    setRequests(reqs => reqs.map(req => req.id === id ? { ...req, status: action } : req));
    setSnackbar({
      open: true,
      message: `Request ${action === 'Approved' ? 'approved' : 'rejected'} successfully!`,
      severity: action === 'Approved' ? 'success' : 'error'
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Baptismal Requests Approval
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Schedule/Event</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(req => (
              <TableRow key={req.id}>
                <TableCell>{req.type}</TableCell>
                <TableCell>{req.name}</TableCell>
                <TableCell>{req.schedule}</TableCell>
                <TableCell>{req.status}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small" 
                      disabled={req.status !== 'Pending'}
                      onClick={() => handleAction(req.id, 'Approved')}
                    >Approve</Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      disabled={req.status !== 'Pending'}
                      onClick={() => handleAction(req.id, 'Rejected')}
                    >Reject</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

