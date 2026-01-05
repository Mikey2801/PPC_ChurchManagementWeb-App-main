import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../utils/api';

export default function ScheduleMass() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    title: '',
    pastor: '',
    description: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/mass-schedules');
      setSchedules(response.data.data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load mass schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        date: schedule.date,
        time: schedule.time,
        title: schedule.title,
        pastor: schedule.pastor || '',
        description: schedule.description || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        date: '',
        time: '',
        title: '',
        pastor: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    setFormData({
      date: '',
      time: '',
      title: '',
      pastor: '',
      description: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.date || !formData.time || !formData.title) {
        setError('Date, time, and title are required');
        return;
      }

      if (editingSchedule) {
        await api.put(`/api/mass-schedules/${editingSchedule.schedule_id}`, formData);
        setSuccessMessage('Mass schedule updated successfully');
      } else {
        await api.post('/api/mass-schedules', formData);
        setSuccessMessage('Mass schedule created successfully');
      }

      handleCloseDialog();
      fetchSchedules();
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err.response?.data?.message || 'Failed to save mass schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mass schedule?')) {
      return;
    }

    try {
      await api.delete(`/api/mass-schedules/${id}`);
      setSuccessMessage('Mass schedule deleted successfully');
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err.response?.data?.message || 'Failed to delete mass schedule');
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Mass Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Schedule
        </Button>
      </Box>

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Pastor</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                    No mass schedules found. Click "Add Schedule" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              schedules
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((schedule) => (
                  <TableRow key={schedule.schedule_id}>
                    <TableCell>
                      {format(new Date(schedule.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{schedule.time}</TableCell>
                    <TableCell>{schedule.title}</TableCell>
                    <TableCell>{schedule.pastor || '-'}</TableCell>
                    <TableCell>
                      {schedule.description
                        ? schedule.description.length > 50
                          ? `${schedule.description.substring(0, 50)}...`
                          : schedule.description
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(schedule)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(schedule.schedule_id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={schedules.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSchedule ? 'Edit Mass Schedule' : 'Add Mass Schedule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="time"
              label="Time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="pastor"
              label="Pastor/Speaker"
              value={formData.pastor}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

