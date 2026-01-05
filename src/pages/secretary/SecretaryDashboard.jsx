import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import api from "../../utils/api";

export default function SecretaryDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalSchedules: 0,
    upcomingSchedules: 0,
    totalAttendance: 0,
    verifiedAttendance: 0,
    pendingAttendance: 0,
    absentAttendance: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get upcoming schedules (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const schedulesResponse = await api.get("/api/mass-schedules", {
        params: {
          startDate: today.toISOString().split("T")[0],
          endDate: nextWeek.toISOString().split("T")[0],
        },
      });

      // Get attendance statistics
      const attendanceStatsResponse = await api.get(
        "/api/attendance/stats/overview"
      );

      // Get all schedules count
      const allSchedulesResponse = await api.get("/api/mass-schedules");

      setStats({
        totalSchedules: allSchedulesResponse.data.data?.length || 0,
        upcomingSchedules: schedulesResponse.data.data?.length || 0,
        totalAttendance: attendanceStatsResponse.data.data?.total || 0,
        verifiedAttendance: attendanceStatsResponse.data.data?.verified || 0,
        pendingAttendance: attendanceStatsResponse.data.data?.pending || 0,
        absentAttendance: attendanceStatsResponse.data.data?.absent || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Mass Schedules",
      value: stats.totalSchedules,
      icon: <EventIcon fontSize="large" color="primary" />,
      color: "#1976d2",
    },
    {
      title: "Upcoming Schedules",
      value: stats.upcomingSchedules,
      icon: <EventIcon fontSize="large" color="warning" />,
      color: "#ed6c02",
    },
    {
      title: "Total Attendance",
      value: stats.totalAttendance,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      color: "#2e7d32",
    },
    {
      title: "Verified Attendance",
      value: stats.verifiedAttendance,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      color: "#2e7d32",
    },
    {
      title: "Pending Verification",
      value: stats.pendingAttendance,
      icon: <PendingIcon fontSize="large" color="warning" />,
      color: "#ed6c02",
    },
    {
      title: "Absent",
      value: stats.absentAttendance,
      icon: <CancelIcon fontSize="large" color="error" />,
      color: "#d32f2f",
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Secretary Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                p: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.2s",
                },
              }}
              onClick={() =>
                (window.location.href = "/secretary/schedule-mass")
              }
            >
              <Box display="flex" alignItems="center" gap={2}>
                <EventIcon color="primary" />
                <Typography variant="body1">Manage Mass Schedules</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                p: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.2s",
                },
              }}
              onClick={() => (window.location.href = "/secretary/verify-attendance")}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon color="success" />
                <Typography variant="body1">Verify Attendance</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

