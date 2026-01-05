import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../utils/api';

export default function VerifyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const [verifyDialog, setVerifyDialog] = useState({ open: false, record: null, action: '' });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get('/api/attendance', { params });
      setAttendance(response.data.data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const handleVerify = (record, action) => {
    setVerifyDialog({ open: true, record, action });
  };

  const handleCloseVerifyDialog = () => {
    setVerifyDialog({ open: false, record: null, action: '' });
  };

  const handleConfirmVerify = async () => {
    try {
      await api.post(`/api/attendance/verify/${verifyDialog.record.attendance_id}`, {
        status: verifyDialog.action,
      });
      setSuccessMessage(
        `Attendance ${verifyDialog.action.toLowerCase()} successfully`
      );
      handleCloseVerifyDialog();
      fetchAttendance();
    } catch (err) {
      console.error('Error verifying attendance:', err);
      setError(err.response?.data?.message || 'Failed to verify attendance');
      handleCloseVerifyDialog();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Absent':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Attendance Verification
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button
            variant="outlined"
            onClick={() => setFilters({ status: '', startDate: '', endDate: '' })}
            sx={{ ml: 'auto' }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member Name</TableCell>
              <TableCell>Schedule Date</TableCell>
              <TableCell>Schedule Time</TableCell>
              <TableCell>Schedule Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Verified By</TableCell>
              <TableCell>Verified At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                    No attendance records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              attendance
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                  <TableRow key={record.attendance_id}>
                    <TableCell>
                      {record.first_name} {record.last_name}
                    </TableCell>
                    <TableCell>
                      {record.schedule_date
                        ? format(new Date(record.schedule_date), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>{record.schedule_time || '-'}</TableCell>
                    <TableCell>{record.schedule_title || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.verified_by_email || '-'}</TableCell>
                    <TableCell>
                      {record.verified_at
                        ? format(new Date(record.verified_at), 'MMM dd, yyyy HH:mm')
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {record.status === 'Pending' && (
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleVerify(record, 'Verified')}
                          >
                            Verify
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleVerify(record, 'Absent')}
                          >
                            Absent
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={attendance.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Verify Dialog */}
      <Dialog open={verifyDialog.open} onClose={handleCloseVerifyDialog}>
        <DialogTitle>Confirm Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this attendance as{' '}
            <strong>{verifyDialog.action}</strong>?
            {verifyDialog.record && (
              <>
                <br />
                <br />
                Member: {verifyDialog.record.first_name} {verifyDialog.record.last_name}
                <br />
                Schedule: {verifyDialog.record.schedule_title}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVerifyDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmVerify}
            variant="contained"
            color={verifyDialog.action === 'Verified' ? 'success' : 'error'}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

