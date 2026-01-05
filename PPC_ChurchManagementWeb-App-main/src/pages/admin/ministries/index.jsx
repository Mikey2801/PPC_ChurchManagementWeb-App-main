import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Group as GroupIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getMinistries, addMinistry, deleteMinistry } from '../../../mock/adminDatabase';

const statusColors = {
  Active: 'success',
  Inactive: 'default',
  Pending: 'warning',
};

export default function Ministries() {
  const theme = useTheme();
  const [ministries, setMinistries] = useState(getMinistries());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, ministry) => {
    setAnchorEl(event.currentTarget);
    setSelectedMinistry(ministry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (ministry) => {
    setSelectedMinistry(ministry);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const confirmDeleteMinistry = () => {
    deleteMinistry(selectedMinistry.id);
    setMinistries(getMinistries());
    setOpenDeleteDialog(false);
  };

  const filteredMinistries = ministries.filter((ministry) => {
    return (
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.leader.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedMinistries = filteredMinistries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Ministry Management</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => {}}>
          Add Ministry
        </Button>
      </Box>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search ministries..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200, maxWidth: 400 }}
          />
          <IconButton onClick={() => setSearchTerm('')}><RefreshIcon /></IconButton>
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ministry</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Leader</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMinistries.length > 0 ? (
              paginatedMinistries.map((ministry) => (
                <TableRow key={ministry.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                        <GroupIcon />
                      </Avatar>
                      <Typography variant="body2">{ministry.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{ministry.description}</TableCell>
                  <TableCell>{ministry.leader}</TableCell>
                  <TableCell>{ministry.members}</TableCell>
                  <TableCell>
                    <Chip label={ministry.status} size="small" color={statusColors[ministry.status] || 'default'} variant="outlined" />
                  </TableCell>
                  <TableCell>{format(new Date(ministry.createdDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, ministry)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">No ministries found matching your criteria</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMinistries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Ministry</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedMinistry)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ministry {selectedMinistry?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDeleteMinistry} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
