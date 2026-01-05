import React, { useState, useEffect } from "react";
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
  DialogActions,
  DialogContentText,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../utils/api";

const statusColors = {
  Active: "success",
  Inactive: "default",
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

export default function Ministries() {
  const [tabValue, setTabValue] = useState(0);
  const [ministries, setMinistries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [appPage, setAppPage] = useState(0);
  const [appRowsPerPage, setAppRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [appSearchTerm, setAppSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMinistry, setFilterMinistry] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [appAnchorEl, setAppAnchorEl] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openViewMembersDialog, setOpenViewMembersDialog] = useState(false);
  const [openViewAppDialog, setOpenViewAppDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [ministryMembersForLeader, setMinistryMembersForLeader] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader_id: "",
    status: "Active",
  });
  const [rejectReason, setRejectReason] = useState("");

  // Fetch ministries
  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/ministries");
      setMinistries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching ministries:", error);
      showSnackbar("Failed to load ministries", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await api.get("/api/ministry-applications");
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      showSnackbar("Failed to load applications", "error");
    } finally {
      setLoadingApplications(false);
    }
  };

  // Fetch users for leader dropdown
  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/auth/users");
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch ministry members
  const fetchMembers = async (ministryId) => {
    try {
      const response = await api.get(`/api/ministries/${ministryId}/members`);
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      showSnackbar("Failed to load members", "error");
    }
  };

  useEffect(() => {
    fetchMinistries();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tabValue === 1) {
      fetchApplications();
    }
  }, [tabValue]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAppChangePage = (event, newPage) => {
    setAppPage(newPage);
  };

  const handleAppChangeRowsPerPage = (event) => {
    setAppRowsPerPage(parseInt(event.target.value, 10));
    setAppPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAppSearch = (event) => {
    setAppSearchTerm(event.target.value);
    setAppPage(0);
  };

  const handleMenuClick = (event, ministry) => {
    setAnchorEl(event.currentTarget);
    setSelectedMinistry(ministry);
  };

  const handleAppMenuClick = (event, application) => {
    setAppAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAppMenuClose = () => {
    setAppAnchorEl(null);
  };

  const handleAddClick = () => {
    setFormData({ name: "", description: "", leader_id: "", status: "Active" });
    setOpenAddDialog(true);
  };

  const handleEditClick = async (ministry) => {
    setSelectedMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description || "",
      leader_id: ministry.leader_id || "",
      status: ministry.status,
    });
    // Fetch ministry members for leader selection
    try {
      const response = await api.get(
        `/api/ministries/${ministry.ministry_id}/members`
      );
      setMinistryMembersForLeader(response.data.data || []);
    } catch (error) {
      console.error("Error fetching ministry members:", error);
      setMinistryMembersForLeader([]);
    }
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = (ministry) => {
    setSelectedMinistry(ministry);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleViewMembersClick = async (ministry) => {
    setSelectedMinistry(ministry);
    await fetchMembers(ministry.ministry_id);
    setOpenViewMembersDialog(true);
    handleMenuClose();
  };

  const handleFormChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleAddMinistry = async () => {
    try {
      await api.post("/api/ministries", formData);
      showSnackbar("Ministry created successfully", "success");
      setOpenAddDialog(false);
      fetchMinistries();
    } catch (error) {
      console.error("Error creating ministry:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create ministry",
        "error"
      );
    }
  };

  const handleUpdateMinistry = async () => {
    try {
      // Convert empty string leader_id to null
      const updateData = {
        ...formData,
        leader_id: formData.leader_id === "" ? null : formData.leader_id,
      };
      await api.put(
        `/api/ministries/${selectedMinistry.ministry_id}`,
        updateData
      );
      showSnackbar("Ministry updated successfully", "success");
      setOpenEditDialog(false);
      fetchMinistries();
    } catch (error) {
      console.error("Error updating ministry:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to update ministry",
        "error"
      );
    }
  };

  const handleDeleteMinistry = async () => {
    try {
      await api.delete(`/api/ministries/${selectedMinistry.ministry_id}`);
      showSnackbar("Ministry deleted successfully", "success");
      setOpenDeleteDialog(false);
      fetchMinistries();
    } catch (error) {
      console.error("Error deleting ministry:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to delete ministry",
        "error"
      );
    }
  };

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setOpenApproveDialog(true);
    handleAppMenuClose();
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setRejectReason("");
    setOpenRejectDialog(true);
    handleAppMenuClose();
  };

  const handleApproveApplication = async () => {
    try {
      await api.put(
        `/api/ministry-applications/${selectedApplication.application_id}/approve`
      );
      showSnackbar("Application approved successfully", "success");
      setOpenApproveDialog(false);
      fetchApplications();
      fetchMinistries();
    } catch (error) {
      console.error("Error approving application:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to approve application",
        "error"
      );
    }
  };

  const handleRejectApplication = async () => {
    if (!rejectReason.trim()) {
      showSnackbar("Please provide a rejection reason", "error");
      return;
    }
    try {
      await api.put(
        `/api/ministry-applications/${selectedApplication.application_id}/reject`,
        {
          rejection_reason: rejectReason,
        }
      );
      showSnackbar("Application rejected successfully", "success");
      setOpenRejectDialog(false);
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to reject application",
        "error"
      );
    }
  };

  const filteredMinistries = ministries.filter((ministry) => {
    return (
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ministry.description &&
        ministry.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (ministry.leader_name &&
        ministry.leader_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      `${app.first_name} ${app.last_name}`
        .toLowerCase()
        .includes(appSearchTerm.toLowerCase()) ||
      app.ministry_name.toLowerCase().includes(appSearchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    const matchesMinistry =
      filterMinistry === "All" || app.ministry_id === parseInt(filterMinistry);
    return matchesSearch && matchesStatus && matchesMinistry;
  });

  const paginatedMinistries = filteredMinistries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const paginatedApplications = filteredApplications.slice(
    appPage * appRowsPerPage,
    appPage * appRowsPerPage + appRowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Ministry Management</Typography>
        {tabValue === 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Ministry
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ministries" />
          <Tab label="Applications" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <>
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
              <IconButton
                onClick={() => {
                  setSearchTerm("");
                  fetchMinistries();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Paper>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
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
                      <TableRow key={ministry.ministry_id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                              <GroupIcon />
                            </Avatar>
                            <Typography variant="body2">
                              {ministry.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{ministry.description || "-"}</TableCell>
                        <TableCell>
                          {ministry.leader_name && ministry.leader_name.trim()
                            ? ministry.leader_name
                            : "N/A"}
                        </TableCell>
                        <TableCell>{ministry.member_count || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={ministry.status}
                            size="small"
                            color={statusColors[ministry.status] || "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {ministry.created_at
                            ? format(
                                new Date(ministry.created_at),
                                "MMM d, yyyy"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, ministry)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No ministries found
                        </Typography>
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
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          <Paper sx={{ mb: 3, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  placeholder="Search applications..."
                  size="small"
                  fullWidth
                  value={appSearchTerm}
                  onChange={handleAppSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ministry</InputLabel>
                  <Select
                    value={filterMinistry}
                    onChange={(e) => setFilterMinistry(e.target.value)}
                    label="Ministry"
                  >
                    <MenuItem value="All">All</MenuItem>
                    {ministries.map((m) => (
                      <MenuItem key={m.ministry_id} value={m.ministry_id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => {
                    setAppSearchTerm("");
                    setFilterStatus("All");
                    setFilterMinistry("All");
                    fetchApplications();
                  }}
                  fullWidth
                >
                  <RefreshIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>

          {loadingApplications ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Applicant</TableCell>
                    <TableCell>Ministry</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedApplications.length > 0 ? (
                    paginatedApplications.map((app) => (
                      <TableRow key={app.application_id} hover>
                        <TableCell>
                          {app.first_name} {app.last_name}
                          <Typography
                            variant="caption"
                            display="block"
                            color="textSecondary"
                          >
                            {app.member_email}
                          </Typography>
                        </TableCell>
                        <TableCell>{app.ministry_name}</TableCell>
                        <TableCell>
                          {format(new Date(app.applied_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.status}
                            size="small"
                            color={statusColors[app.status] || "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleAppMenuClick(e, app)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No applications found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredApplications.length}
                rowsPerPage={appRowsPerPage}
                page={appPage}
                onPageChange={handleAppChangePage}
                onRowsPerPageChange={handleAppChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </>
      )}

      {/* Ministry Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewMembersClick(selectedMinistry)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Members</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEditClick(selectedMinistry)}>
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

      {/* Application Action Menu */}
      <Menu
        anchorEl={appAnchorEl}
        open={Boolean(appAnchorEl)}
        onClose={handleAppMenuClose}
      >
        <MenuItem
          onClick={() => {
            setOpenViewAppDialog(true);
            handleAppMenuClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {selectedApplication?.status === "Pending" && (
          <>
            <MenuItem onClick={() => handleApproveClick(selectedApplication)}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleRejectClick(selectedApplication)}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* View Application Details Dialog */}
      <Dialog
        open={openViewAppDialog}
        onClose={() => setOpenViewAppDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Applicant</Typography>
                <Typography>
                  {selectedApplication.first_name}{" "}
                  {selectedApplication.last_name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {selectedApplication.member_email} |{" "}
                  {selectedApplication.contact_number || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Ministry</Typography>
                <Typography>{selectedApplication.ministry_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Reason for Joining</Typography>
                <Typography>{selectedApplication.reason}</Typography>
              </Grid>
              {selectedApplication.experience && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Previous Experience
                  </Typography>
                  <Typography>{selectedApplication.experience}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedApplication.status}
                  size="small"
                  color={statusColors[selectedApplication.status] || "default"}
                />
              </Grid>
              {selectedApplication.rejection_reason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Rejection Reason</Typography>
                  <Typography color="error">
                    {selectedApplication.rejection_reason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewAppDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Ministry Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Ministry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ministry Name"
                value={formData.name}
                onChange={handleFormChange("name")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleFormChange("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leader</InputLabel>
                <Select
                  value={formData.leader_id}
                  onChange={handleFormChange("leader_id")}
                  label="Leader"
                >
                  <MenuItem value="">None</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.user_id} value={user.user_id}>
                      {user.name || user.email_address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleFormChange("status")}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddMinistry}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Ministry Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setMinistryMembersForLeader([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Ministry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ministry Name"
                value={formData.name}
                onChange={handleFormChange("name")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleFormChange("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leader</InputLabel>
                <Select
                  value={formData.leader_id}
                  onChange={handleFormChange("leader_id")}
                  label="Leader"
                >
                  <MenuItem value="">None</MenuItem>
                  {(() => {
                    // Get member_ids and user_ids of ministry members
                    const ministryMemberIds = ministryMembersForLeader.map(
                      (member) => member.member_id
                    );
                    const ministryMemberUserIds = ministryMembersForLeader
                      .map((member) => member.user_id)
                      .filter((id) => id != null);

                    // Filter users to only show ministry members (match by member_id or user_id),
                    // plus the current leader if they're not a member
                    const filteredUsers = users.filter(
                      (user) =>
                        (user.member_id &&
                          ministryMemberIds.includes(user.member_id)) ||
                        ministryMemberUserIds.includes(user.user_id) ||
                        (formData.leader_id &&
                          user.user_id === formData.leader_id)
                    );

                    if (filteredUsers.length === 0) {
                      return (
                        <MenuItem disabled value="">
                          No members with user accounts
                        </MenuItem>
                      );
                    }

                    return filteredUsers.map((user) => (
                      <MenuItem key={user.user_id} value={user.user_id}>
                        {user.name || user.email_address}
                      </MenuItem>
                    ));
                  })()}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleFormChange("status")}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateMinistry}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete ministry "{selectedMinistry?.name}"?
            This action cannot be undone and will also delete all associated
            applications and member records.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteMinistry}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Application Dialog */}
      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
      >
        <DialogTitle>Approve Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve the application from{" "}
            {selectedApplication?.first_name} {selectedApplication?.last_name}{" "}
            for {selectedApplication?.ministry_name}? The applicant will be
            added to the ministry roster.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button
            onClick={handleApproveApplication}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Application Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRejectApplication}
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Members Dialog */}
      <Dialog
        open={openViewMembersDialog}
        onClose={() => setOpenViewMembersDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ministry Members - {selectedMinistry?.name}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member.ministry_member_id}>
                      <TableCell>
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell>{member.email_address}</TableCell>
                      <TableCell>{member.contact_number || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(member.joined_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                      <Typography color="textSecondary">
                        No members in this ministry
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewMembersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
