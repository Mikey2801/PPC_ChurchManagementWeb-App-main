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
  Tabs,
  Tab,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

export default function MyMinistries() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 = My Ministries, 1 = Application Status
  const [applications, setApplications] = useState([]);
  const [myMinistries, setMyMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMinistries, setLoadingMinistries] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [ministryMembers, setMinistryMembers] = useState([]);
  const [openMinistryDialog, setOpenMinistryDialog] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch user's applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/ministry-applications");
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ministries user is a member of
  const fetchMyMinistries = async () => {
    try {
      setLoadingMinistries(true);
      const response = await api.get("/api/ministries/my-ministries");
      setMyMinistries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching my ministries:", error);
      setMyMinistries([]);
    } finally {
      setLoadingMinistries(false);
    }
  };

  // Fetch ministry members
  const fetchMinistryMembers = async (ministryId) => {
    try {
      setLoadingMembers(true);
      const response = await api.get(`/api/ministries/${ministryId}/members`);
      setMinistryMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching ministry members:", error);
      setMinistryMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Handle ministry card click
  const handleMinistryClick = async (ministry) => {
    setSelectedMinistry(ministry);
    await fetchMinistryMembers(ministry.ministry_id);
    setOpenMinistryDialog(true);
  };

  useEffect(() => {
    fetchMyMinistries();
  }, []);

  useEffect(() => {
    if (tabValue === 1) {
      fetchApplications();
    }
  }, [tabValue]);

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

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setOpenDetailsDialog(true);
  };

  const paginatedApplications = applications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Ministries</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/dashboard/ministry/apply")}
            sx={{ color: "white" }}
          >
            Apply for Ministry
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              if (tabValue === 0) {
                fetchMyMinistries();
              } else {
                fetchApplications();
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Ministries" />
          <Tab label="Application Status" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <>
          {myMinistries.length === 0 && !loadingMinistries ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <GroupsIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Ministries Yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You are not currently a member of any ministries. Apply to
                ministries to get started!
              </Typography>
            </Paper>
          ) : loadingMinistries ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {myMinistries.map((ministry) => (
                <Grid item xs={12} md={6} key={ministry.ministry_id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleMinistryClick(ministry)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <GroupsIcon
                          sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">{ministry.name}</Typography>
                          <Chip
                            label={ministry.status}
                            size="small"
                            color={
                              ministry.status === "Active"
                                ? "success"
                                : "default"
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      {ministry.description && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          paragraph
                        >
                          {ministry.description}
                        </Typography>
                      )}
                      <Box mt={2}>
                        <Typography variant="caption" color="textSecondary">
                          Leader:{" "}
                          {ministry.leader_name && ministry.leader_name.trim()
                            ? ministry.leader_name
                            : "N/A"}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          Joined:{" "}
                          {format(new Date(ministry.joined_at), "MMM d, yyyy")}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {applications.length === 0 && !loading ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Applications Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You haven't applied to any ministries yet.
              </Typography>
            </Paper>
          ) : loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ministry</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedApplications.map((app) => (
                    <TableRow key={app.application_id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {app.ministry_name}
                        </Typography>
                        {app.status === "Rejected" && app.rejection_reason && (
                          <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                            <Typography variant="caption">
                              <strong>Reason:</strong> {app.rejection_reason}
                            </Typography>
                          </Alert>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(app.applied_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          size="small"
                          color={statusColors[app.status] || "default"}
                          icon={
                            app.status === "Approved" ? (
                              <CheckCircleIcon fontSize="small" />
                            ) : app.status === "Rejected" ? (
                              <CancelIcon fontSize="small" />
                            ) : null
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(app)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={applications.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </>
      )}

      {/* Application Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Ministry</Typography>
                <Typography variant="h6">
                  {selectedApplication.ministry_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedApplication.status}
                  size="medium"
                  color={statusColors[selectedApplication.status] || "default"}
                  icon={
                    selectedApplication.status === "Approved" ? (
                      <CheckCircleIcon />
                    ) : selectedApplication.status === "Rejected" ? (
                      <CancelIcon />
                    ) : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Applied Date</Typography>
                <Typography>
                  {format(
                    new Date(selectedApplication.applied_at),
                    "MMMM d, yyyy"
                  )}
                </Typography>
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
              {selectedApplication.rejection_reason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="subtitle2" gutterBottom>
                      Rejection Reason
                    </Typography>
                    <Typography>
                      {selectedApplication.rejection_reason}
                    </Typography>
                  </Alert>
                </Grid>
              )}
              {selectedApplication.reviewed_at && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Reviewed Date</Typography>
                  <Typography>
                    {format(
                      new Date(selectedApplication.reviewed_at),
                      "MMMM d, yyyy"
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Ministry Details Dialog */}
      <Dialog
        open={openMinistryDialog}
        onClose={() => setOpenMinistryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedMinistry?.name}</DialogTitle>
        <DialogContent>
          {selectedMinistry && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography>
                  {selectedMinistry.description || "No description available"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedMinistry.status}
                  size="small"
                  color={
                    selectedMinistry.status === "Active" ? "success" : "default"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Leader</Typography>
                <Typography>
                  {selectedMinistry.leader_name &&
                  selectedMinistry.leader_name.trim()
                    ? selectedMinistry.leader_name
                    : "N/A"}
                </Typography>
                {selectedMinistry.leader_email && (
                  <Typography variant="caption" color="textSecondary">
                    {selectedMinistry.leader_email}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Members ({ministryMembers.length})
                </Typography>
                {loadingMembers ? (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : ministryMembers.length > 0 ? (
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
                        {ministryMembers.map((member) => (
                          <TableRow key={member.ministry_member_id}>
                            <TableCell>
                              {member.first_name} {member.last_name}
                            </TableCell>
                            <TableCell>{member.email_address}</TableCell>
                            <TableCell>
                              {member.contact_number || "-"}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(member.joined_at),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No members found
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">You Joined</Typography>
                <Typography>
                  {format(new Date(selectedMinistry.joined_at), "MMMM d, yyyy")}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMinistryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
