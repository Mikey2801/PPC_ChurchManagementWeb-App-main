import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";

const MemberDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "My Profile",
      icon: <PersonIcon fontSize="large" color="primary" />,
      path: "/dashboard/profile",
    },
    {
      title: "Events",
      icon: <EventIcon fontSize="large" color="primary" />,
      path: "/events",
    },
    {
      title: "My Ministries",
      icon: <GroupsIcon fontSize="large" color="primary" />,
      path: "/dashboard/ministry/my-ministries",
    },
    {
      title: "Baptismal Cert",
      icon: <ReceiptIcon fontSize="large" color="primary" />,
      path: "/dashboard/baptismal-certificate",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              mb: isMobile ? 2 : 0,
              mr: isMobile ? 0 : 3,
            }}
          >
            {user?.first_name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user?.first_name || "User"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => navigate("/dashboard/profile/edit")}
              size={isMobile ? "small" : "medium"}
            >
              Settings
            </Button>
          </Box>
        </Box>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Quick Actions
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box sx={{ mb: 2 }}>{action.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {action.title}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(action.path)}
                  fullWidth
                  sx={{ mx: 2 }}
                >
                  Go to {action.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Upcoming Events
        </Typography>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No upcoming events. Check back later!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/events")}
          >
            View All Events
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Recent Activity
        </Typography>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" gutterBottom>
            No recent activity to display.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your recent activities will appear here.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MemberDashboard;
