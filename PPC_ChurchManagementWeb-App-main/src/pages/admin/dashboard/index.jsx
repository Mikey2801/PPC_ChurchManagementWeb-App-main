import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Groups as GroupsIcon,
  Event as EventIcon,
  MonetizationOn as DonationIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaptismalApprovals from './BaptismalApprovals';

// Sample data for the chart
const data = [
  { name: 'Jan', users: 4000, events: 2400, donations: 2400 },
  { name: 'Feb', users: 3000, events: 1398, donations: 2210 },
  { name: 'Mar', users: 2000, events: 9800, donations: 2290 },
  { name: 'Apr', users: 2780, events: 3908, donations: 2000 },
  { name: 'May', users: 1890, events: 4800, donations: 2181 },
  { name: 'Jun', users: 2390, events: 3800, donations: 2500 },
  { name: 'Jul', users: 3490, events: 4300, donations: 2100 },
];

const stats = [
  { 
    title: 'Total Users', 
    value: '1,234', 
    change: 12, 
    isPositive: true,
    icon: <PeopleIcon fontSize="large" color="primary" />
  },
  { 
    title: 'Active Ministries', 
    value: '24', 
    change: 4, 
    isPositive: true,
    icon: <GroupsIcon fontSize="large" color="primary" />
  },
  { 
    title: 'Upcoming Events', 
    value: '8', 
    change: 2, 
    isPositive: true,
    icon: <EventIcon fontSize="large" color="primary" />
  },
  { 
    title: 'Total Donations', 
    value: '₱45,678', 
    change: 8.5, 
    isPositive: false,
    icon: <DonationIcon fontSize="large" color="primary" />
  },
];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'created a new event', time: '5 minutes ago' },
  { id: 2, user: 'Jane Smith', action: 'updated ministry details', time: '2 hours ago' },
  { id: 3, user: 'Mike Johnson', action: 'made a donation', time: '5 hours ago' },
  { id: 4, user: 'Sarah Williams', action: 'registered for an event', time: '1 day ago' },
  { id: 5, user: 'David Brown', action: 'joined a ministry', time: '2 days ago' },
];

export default function AdminDashboard() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.isPositive ? (
                        <ArrowUpwardIcon color="success" fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon color="error" fontSize="small" />
                      )}
                      <Typography 
                        variant="body2" 
                        color={stat.isPositive ? 'success.main' : 'error.main'}
                        ml={0.5}
                      >
                        {stat.change}% from last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Activity Overview</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="events" stroke={theme.palette.success.main} />
                  <Line type="monotone" dataKey="donations" stroke={theme.palette.secondary.main} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {activity.user.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography component="span" variant="subtitle2">
                            {activity.user}
                          </Typography>
                          {' '}{activity.action}
                        </React.Fragment>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Storage Usage</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Documents</Typography>
                <Typography variant="body2">65%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={65} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Images</Typography>
                <Typography variant="body2">45%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={45} color="secondary" sx={{ height: 10, borderRadius: 5, mb: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Videos</Typography>
                <Typography variant="body2">30%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={30} color="info" sx={{ height: 10, borderRadius: 5 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {[
                { title: 'Add New User', icon: '👥' },
                { title: 'Create Event', icon: '📅' },
                { title: 'Add Ministry', icon: '⛪' },
                { title: 'Generate Report', icon: '📊' },
              ].map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                      textAlign: 'center',
                      minHeight: 120
                    }}
                  >
                    <Box fontSize={32} mb={1}>{action.icon}</Box>
                    <Typography variant="subtitle2">{action.title}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {/* Baptismal Approvals Section */}
      <Box sx={{ mt: 6 }}>
        <BaptismalApprovals />
      </Box>
    </Box>
  );
}
