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
  Button,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const initialDonations = [
  { id: 'DNT-001', date: '2024-01-12T09:30:00Z', category: 'Tithes', amount: 1300, name: 'Alice Moreno', email: 'alice@example.com', phone: '+639171234001', message: 'Blessings', paymentMethod: 'GCash' },
  { id: 'DNT-002', date: '2024-01-20T11:10:00Z', category: 'Offerings', amount: 500, name: 'Ben Santos', email: 'ben@example.com', phone: '+639171234002', message: '', paymentMethod: 'Cash' },
  { id: 'DNT-003', date: '2024-02-05T08:45:00Z', category: 'Special Contributions', amount: 10000, name: 'Ceres Logistics', email: 'contact@cereslg.com', phone: '+6328123003', message: 'Building fund', paymentMethod: 'Bank Transfer' },
  { id: 'DNT-004', date: '2024-03-18T14:00:00Z', category: 'Tithes', amount: 2200, name: 'David Lim', email: 'dlim@example.com', phone: '+639171234004', message: 'Family tithe', paymentMethod: 'PayPal' },
  { id: 'DNT-005', date: '2024-04-02T10:20:00Z', category: 'Offerings', amount: 300, name: 'Ella Cruz', email: 'ella@example.com', phone: '+639171234005', message: '', paymentMethod: 'Cash' },
  { id: 'DNT-006', date: '2024-05-27T17:15:00Z', category: 'Tithes', amount: 1800, name: 'Francis Reyes', email: 'francis@example.com', phone: '+639171234006', message: 'For ministry', paymentMethod: 'GCash' },
  { id: 'DNT-007', date: '2024-06-10T13:05:00Z', category: 'Special Contributions', amount: 4500, name: 'Grace Home', email: 'grace@home.com', phone: '+639171234007', message: 'Outreach', paymentMethod: 'Bank Transfer' },
  { id: 'DNT-008', date: '2024-07-22T09:50:00Z', category: 'Offerings', amount: 650, name: 'Hector Ramos', email: 'hector@example.com', phone: '+639171234008', message: '', paymentMethod: 'GCash' },
  { id: 'DNT-009', date: '2024-08-13T19:30:00Z', category: 'Tithes', amount: 2100, name: 'Ivy Tan', email: 'ivy@example.com', phone: '+639171234009', message: 'Monthly', paymentMethod: 'PayPal' },
  { id: 'DNT-010', date: '2024-09-01T07:40:00Z', category: 'Offerings', amount: 420, name: 'John Perez', email: 'johnp@example.com', phone: '+639171234010', message: '', paymentMethod: 'Cash' },
  { id: 'DNT-011', date: '2024-10-30T16:00:00Z', category: 'Special Contributions', amount: 7500, name: 'KMC Enterprises', email: 'info@kmc.com', phone: '+6328123011', message: 'Event sponsorship', paymentMethod: 'Bank Transfer' },
  { id: 'DNT-012', date: '2024-11-11T12:25:00Z', category: 'Tithes', amount: 1600, name: 'Lara Gomez', email: 'lara@example.com', phone: '+639171234012', message: '', paymentMethod: 'GCash' },
  { id: 'DNT-013', date: '2024-12-24T20:00:00Z', category: 'Offerings', amount: 1200, name: 'Manny D', email: 'manny@example.com', phone: '+639171234013', message: 'Christmas', paymentMethod: 'Cash' },
  { id: 'DNT-014', date: '2025-01-05T09:00:00Z', category: 'Tithes', amount: 1750, name: 'Nina Lopez', email: 'nina@example.com', phone: '+639171234014', message: '', paymentMethod: 'PayPal' },
  { id: 'DNT-015', date: '2025-02-14T15:30:00Z', category: 'Special Contributions', amount: 3000, name: 'Olivia Corp', email: 'donate@olivia.com', phone: '+6328123015', message: 'Support program', paymentMethod: 'Bank Transfer' },
];

const categories = ['All', 'Tithes', 'Offerings', 'Special Contributions'];

export default function AdminDonations() {
  const theme = useTheme();
  const [donations] = useState(initialDonations);
  const [filterCategory, setFilterCategory] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCategoryClick = (e) => setAnchorEl(e.currentTarget);
  const handleCategoryClose = (cat) => {
    if (cat) setFilterCategory(cat);
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filtered = donations.filter((d) => filterCategory === 'All' || d.category === filterCategory);
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const currency = (v) => `₱${v.toLocaleString()}`;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Donations
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Left: filter button */}
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleCategoryClick}
              sx={{ textTransform: 'none' }}
            >
              {filterCategory}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleCategoryClose()}>
              {categories.map((cat) => (
                <MenuItem key={cat} selected={cat === filterCategory} onClick={() => handleCategoryClose(cat)}>
                  {cat}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Right: keep empty to align with filter */}
          <Box />
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Payment Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((d) => (
                  <TableRow key={d.id} hover sx={{ cursor: 'default' }}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{format(new Date(d.date), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell align="right">{currency(d.amount)}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.phone || '-'}</TableCell>
                    <TableCell>{d.message || '-'}</TableCell>
                    <TableCell>{d.paymentMethod}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No donations found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}