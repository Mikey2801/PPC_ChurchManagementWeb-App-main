import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import logo from "../../assets/logo.png";

export default function ApplicationForMinistry() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ministries, setMinistries] = useState([]);
  const [loadingMinistries, setLoadingMinistries] = useState(true);
  const [existingApplication, setExistingApplication] = useState(null);
  const [formData, setFormData] = useState({
    ministry_id: "",
    experience: "",
    reason: "",
  });

  // Fetch available ministries on component mount
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoadingMinistries(true);
        const response = await api.get("/api/ministries?status=Active");
        setMinistries(response.data.data || []);
      } catch (error) {
        console.error("Error fetching ministries:", error);
        setErrorMessage("Failed to load ministries. Please try again.");
        setShowError(true);
      } finally {
        setLoadingMinistries(false);
      }
    };

    fetchMinistries();
  }, []);

  // Check for existing applications when ministry is selected
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!formData.ministry_id) {
        setExistingApplication(null);
        return;
      }

      try {
        const response = await api.get("/api/ministry-applications");
        const applications = response.data.data || [];
        const existing = applications.find(
          (app) =>
            app.ministry_id === parseInt(formData.ministry_id) &&
            app.status !== "Rejected"
        );
        setExistingApplication(existing || null);
      } catch (error) {
        console.error("Error checking existing applications:", error);
      }
    };

    checkExistingApplication();
  }, [formData.ministry_id]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.ministry_id || !formData.reason || !formData.reason.trim()) {
      setErrorMessage(
        "Please fill in the Ministry and Reason for Joining fields."
      );
      setShowError(true);
      return;
    }

    // Check if user already has an application
    if (existingApplication) {
      setErrorMessage(
        `You already have an application for this ministry (Status: ${existingApplication.status}).`
      );
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      const response = await api.post("/api/ministry-applications", {
        ministry_id: parseInt(formData.ministry_id),
        reason: formData.reason.trim(),
        experience: formData.experience.trim() || null,
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/ministry/my-ministries");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      const message =
        error.response?.data?.message ||
        "Failed to submit application. Please try again.";
      setErrorMessage(message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // If user already has a pending/approved application for selected ministry, show message
  const isApplicationPending =
    existingApplication && existingApplication.status === "Pending";
  const isApplicationApproved =
    existingApplication && existingApplication.status === "Approved";

  return (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <img
            src={logo}
            alt="Pamukid Presbyterian Church"
            style={{
              width: "150px",
              height: "auto",
              marginBottom: "24px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h4">Ministry Application</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard/ministry/my-ministries")}
            >
              Back to My Ministries
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your interest in serving in our church ministries.
          Please fill out the form below to apply. If you have any questions,
          please visit our{" "}
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => navigate("/dashboard/ministry/contacts")}
            sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
          >
            Ministry Contacts
          </Button>{" "}
          page to get in touch with ministry leaders.
        </Typography>

        {loadingMinistries ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Ministry</InputLabel>
                  <Select
                    value={formData.ministry_id}
                    onChange={handleChange("ministry_id")}
                    label="Ministry"
                    disabled={isApplicationPending || isApplicationApproved}
                  >
                    {ministries.map((ministry) => (
                      <MenuItem
                        key={ministry.ministry_id}
                        value={ministry.ministry_id}
                      >
                        {ministry.name}
                        {ministry.description && ` - ${ministry.description}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {isApplicationPending && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    You have a pending application for this ministry. Status:{" "}
                    {existingApplication.status}
                  </Alert>
                )}
                {isApplicationApproved && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Your application for this ministry has been approved! You
                    are now a member.
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Previous Experience (Optional)"
                  value={formData.experience}
                  onChange={handleChange("experience")}
                  helperText="Share any relevant experience you have in this ministry area"
                  disabled={isApplicationPending || isApplicationApproved}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Why do you want to join this ministry?"
                  value={formData.reason}
                  onChange={handleChange("reason")}
                  disabled={isApplicationPending || isApplicationApproved}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <SendIcon />
                    }
                    disabled={
                      loading || isApplicationPending || isApplicationApproved
                    }
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Application submitted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
