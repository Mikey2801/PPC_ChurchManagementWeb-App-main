import React, { useEffect, useState, useMemo } from "react";
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  useTheme,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Tabs,
  Tab,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Description as ReportIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const initialTransactions = [
  { id: "T-2024-01-I", date: "2024-01-15T10:00:00Z", type: "income", amount: 13067, category: "Sunday Collection" },
  { id: "T-2024-01-E", date: "2024-01-15T10:00:00Z", type: "expense", amount: 15819, category: "Operating" },

  { id: "T-2024-02-I", date: "2024-02-15T10:00:00Z", type: "income", amount: 54992, category: "Campaigns" },
  { id: "T-2024-02-E", date: "2024-02-15T10:00:00Z", type: "expense", amount: 16102, category: "Operating" },

  { id: "T-2024-03-I", date: "2024-03-15T10:00:00Z", type: "income", amount: 22878, category: "Sunday Collection" },
  { id: "T-2024-03-E", date: "2024-03-15T10:00:00Z", type: "expense", amount: 30038, category: "Operating" },

  { id: "T-2024-04-I", date: "2024-04-15T10:00:00Z", type: "income", amount: 13555, category: "Special Collection" },
  { id: "T-2024-04-E", date: "2024-04-15T10:00:00Z", type: "expense", amount: 16958, category: "Operating" },

  { id: "T-2024-05-I", date: "2024-05-15T10:00:00Z", type: "income", amount: 8938, category: "Special Collection" },
  { id: "T-2024-05-E", date: "2024-05-15T10:00:00Z", type: "expense", amount: 19175, category: "Operating" },

  { id: "T-2024-06-I", date: "2024-06-15T10:00:00Z", type: "income", amount: 13408, category: "Sunday Collection" },
  { id: "T-2024-06-E", date: "2024-06-15T10:00:00Z", type: "expense", amount: 23675, category: "Operating" },

  { id: "T-2024-07-I", date: "2024-07-15T10:00:00Z", type: "income", amount: 19533, category: "Sunday Collection" },
  { id: "T-2024-07-E", date: "2024-07-15T10:00:00Z", type: "expense", amount: 18258, category: "Operating" },

  { id: "T-2024-08-I", date: "2024-08-15T10:00:00Z", type: "income", amount: 22189, category: "Sunday Collection" },
  { id: "T-2024-08-E", date: "2024-08-15T10:00:00Z", type: "expense", amount: 20365, category: "Operating" },

  { id: "T-2024-09-I", date: "2024-09-15T10:00:00Z", type: "income", amount: 22077, category: "Sunday Collection" },
  { id: "T-2024-09-E", date: "2024-09-15T10:00:00Z", type: "expense", amount: 36880, category: "Operating" },

  { id: "T-2024-10-I", date: "2024-10-15T10:00:00Z", type: "income", amount: 20578, category: "Sunday Collection" },
  { id: "T-2024-10-E", date: "2024-10-15T10:00:00Z", type: "expense", amount: 16843, category: "Operating" },

  { id: "T-2024-11-I", date: "2024-11-15T10:00:00Z", type: "income", amount: 20390, category: "Sunday Collection" },
  { id: "T-2024-11-E", date: "2024-11-15T10:00:00Z", type: "expense", amount: 17786, category: "Operating" },

  { id: "T-2024-12-I", date: "2024-12-15T10:00:00Z", type: "income", amount: 33295, category: "Seasonal" },
  { id: "T-2024-12-E", date: "2024-12-15T10:00:00Z", type: "expense", amount: 29920, category: "Operating" },

  { id: "T-2025-01-I", date: "2025-01-15T10:00:00Z", type: "income", amount: 14112, category: "Sunday Collection" },
  { id: "T-2025-01-E", date: "2025-01-15T10:00:00Z", type: "expense", amount: 15027, category: "Operating" },

  { id: "T-2025-02-I", date: "2025-02-15T10:00:00Z", type: "income", amount: 59391, category: "Campaigns" },
  { id: "T-2025-02-E", date: "2025-02-15T10:00:00Z", type: "expense", amount: 15297, category: "Operating" },

  { id: "T-2025-03-I", date: "2025-03-15T10:00:00Z", type: "income", amount: 24708, category: "Sunday Collection" },
  { id: "T-2025-03-E", date: "2025-03-15T10:00:00Z", type: "expense", amount: 28536, category: "Operating" },

  { id: "T-2025-04-I", date: "2025-04-15T10:00:00Z", type: "income", amount: 14639, category: "Special Collection" },
  { id: "T-2025-04-E", date: "2025-04-15T10:00:00Z", type: "expense", amount: 16110, category: "Operating" },

  { id: "T-2025-05-I", date: "2025-05-15T10:00:00Z", type: "income", amount: 9653, category: "Special Collection" },
  { id: "T-2025-05-E", date: "2025-05-15T10:00:00Z", type: "expense", amount: 18216, category: "Operating" },

  { id: "T-2025-06-I", date: "2025-06-15T10:00:00Z", type: "income", amount: 14481, category: "Sunday Collection" },
  { id: "T-2025-06-E", date: "2025-06-15T10:00:00Z", type: "expense", amount: 22491, category: "Operating" },

  { id: "T-2025-07-I", date: "2025-07-15T10:00:00Z", type: "income", amount: 21096, category: "Sunday Collection" },
  { id: "T-2025-07-E", date: "2025-07-15T10:00:00Z", type: "expense", amount: 17345, category: "Operating" },

  { id: "T-2025-08-I", date: "2025-08-15T10:00:00Z", type: "income", amount: 23964, category: "Sunday Collection" },
  { id: "T-2025-08-E", date: "2025-08-15T10:00:00Z", type: "expense", amount: 19347, category: "Operating" },

  { id: "T-2025-09-I", date: "2025-09-15T10:00:00Z", type: "income", amount: 23843, category: "Sunday Collection" },
  { id: "T-2025-09-E", date: "2025-09-15T10:00:00Z", type: "expense", amount: 35036, category: "Operating" },

  { id: "T-2025-10-I", date: "2025-10-15T10:00:00Z", type: "income", amount: 22224, category: "Sunday Collection" },
  { id: "T-2025-10-E", date: "2025-10-15T10:00:00Z", type: "expense", amount: 16001, category: "Operating" },

  { id: "T-2025-11-I", date: "2025-11-15T10:00:00Z", type: "income", amount: 22021, category: "Sunday Collection" },
  { id: "T-2025-11-E", date: "2025-11-15T10:00:00Z", type: "expense", amount: 16897, category: "Operating" },

  { id: "T-2025-12-I", date: "2025-12-15T10:00:00Z", type: "income", amount: 35959, category: "Seasonal" },
  { id: "T-2025-12-E", date: "2025-12-15T10:00:00Z", type: "expense", amount: 28424, category: "Operating" },
];

const types = ["income", "expense"];
const categories = ["Sunday Collection", "Special Collection", "Campaigns", "Other"];
const paymentMethods = ["Cash", "GCash", "Bank Transfer", "PayPal", "Other"];

export default function AdminCollections() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorYearEl, setAnchorYearEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState("All");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tab, setTab] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRefresh = () => {
    setTransactions([...initialTransactions]);
    setSelectedItem(null);
  };

  const handleAdd = () => setOpenAddDialog(true);
  const handleEdit = () => {
    if (!selectedItem) return;
    alert("Open edit UI for " + selectedItem.id + " (not implemented)");
  };
  const handleDeleteClick = () => {
    if (!selectedItem) return;
    setOpenDeleteDialog(true);
  };
  const confirmDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== selectedItem.id));
    setSelectedItem(null);
    setOpenDeleteDialog(false);
  };

  const yearsSet = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
  yearsSet.add(2026);
  const years = ["All", ...Array.from(yearsSet).sort((a, b) => b - a).map(String)];

  const handleYearClick = (e) => setAnchorYearEl(e.currentTarget);
  const handleYearClose = (year) => {
    if (year) setSelectedYear(year);
    setAnchorYearEl(null);
  };

  const filteredTransactions =
    selectedYear === "All"
      ? transactions
      : transactions.filter((t) => new Date(t.date).getFullYear().toString() === selectedYear);

  const monthlyMap = {};
  filteredTransactions.forEach((t) => {
    const date = new Date(t.date);
    const key = format(date, "yyyy-MM"); 
    const label = format(date, "MMM yyyy");
    if (!monthlyMap[key]) monthlyMap[key] = { label, income: 0, expenses: 0 };
    if (t.type === "income") monthlyMap[key].income += t.amount;
    else monthlyMap[key].expenses += t.amount;
  });

  const monthlyRows = Object.keys(monthlyMap).sort((a, b) => a.localeCompare(b)).map((k) => monthlyMap[k]);

  const currency = (v) => `₱${v.toLocaleString()}`;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Collection Management
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Left: year filter button */}
          <Box display="flex" alignItems="center" gap={1}>
            <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleYearClick} sx={{ textTransform: "none" }}>
              {selectedYear}
            </Button>
            <Menu anchorEl={anchorYearEl} open={Boolean(anchorYearEl)} onClose={() => handleYearClose()}>
              {years.map((y) => (
                <MenuItem key={y} selected={y === selectedYear} onClick={() => handleYearClose(y)}>
                  {y}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Right: action buttons only shown on the Collection tab */}
          {tab === 0 ? (
            <Box display="flex" gap={1} alignItems="center">
              <IconButton onClick={handleRefresh} title="Refresh">
                <RefreshIcon />
              </IconButton>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
                Add
              </Button>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit} disabled={!selectedItem}>
                Edit
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteClick} disabled={!selectedItem}>
                Delete
              </Button>
            </Box>
          ) : (
            <Box /> /* keep right side empty for alignment when on Monthly tab */
          )}
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Collection" />
          <Tab label="Monthly Income and Expences" />
        </Tabs>

        {tab === 0 && (
          <Box p={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="textSecondary">No transactions</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((t) => (
                        <TableRow key={t.id} hover selected={selectedItem?.id === t.id} onClick={() => setSelectedItem(t)} sx={{ cursor: "pointer" }}>
                          <TableCell>{t.id}</TableCell>
                          <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{t.type}</TableCell>
                          <TableCell>{t.category || "-"}</TableCell>
                          <TableCell align="right">{currency(t.amount)}</TableCell>
                          <TableCell>{t.notes || "-"}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredTransactions.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
          </Box>
        )}

        {tab === 1 && (
          <Box p={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Income</TableCell>
                    <TableCell align="right">Expenses</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyRows.length > 0 ? (
                    monthlyRows.map((r) => (
                      <TableRow key={r.label} hover sx={{ cursor: "default" }}>
                        <TableCell>{r.label}</TableCell>
                        <TableCell align="right">{currency(r.income)}</TableCell>
                        <TableCell align="right">{currency(r.expenses)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">No monthly data</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" startIcon={<ReportIcon />} onClick={() => alert("Generate report (not implemented)")}>
          Generate Report
        </Button>
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {selectedItem?.id}? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddCollectionDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={(data) => {
          const item = { ...data, date: data.date || new Date().toISOString(), id: data.id || `COL-${Date.now()}` };
          setTransactions((s) => [...s, item]);
          setOpenAddDialog(false);
        }}
      />
    </Box>
  );
}

function AddCollectionDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    type: "income",
    category: "Sunday Collection",
    amount: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm({ type: "income", category: "Sunday Collection", amount: "", notes: "" });
      setErrors({});
    }
  }, [open]);

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.category) e.category = "Category required";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter amount > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = {
      id: `COL-${Date.now()}`,
      date: new Date().toISOString(),
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      notes: form.notes || "",
    };
    if (onSave) onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Collection</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={handleChange("type")}>
                {types.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={handleChange("category")}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField label="Amount" type="number" value={form.amount} onChange={handleChange("amount")} error={!!errors.amount} helperText={errors.amount} fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Notes" value={form.notes} onChange={handleChange("notes")} fullWidth multiline rows={3} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}