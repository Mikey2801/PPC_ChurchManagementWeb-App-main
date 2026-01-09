import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { UserProvider } from "./context/UserContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header.jsx";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import OurTeam from "./pages/OurTeam";
import OurProgram from "./pages/OurProgram";
import Events from "./pages/Events";
import VisitUs from "./pages/VisitUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MassAndEventSchedule from "./pages/MassAndEventSchedule";
import Donate from "./pages/Donate";
import MemberDashboard from "./pages/member/MemberDashboard";
import Services from "./pages/Services";
import MassAttendance from "./pages/MassAttendance";
import ApplicationForMinistry from "./pages/member/ApplicationForMinistry";
import MyMinistries from "./pages/member/MyMinistries";
import ApplicationMinistryContacts from "./pages/ApplicationMinistryContacts";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import BaptismalCertificate from "./pages/BaptismalCertificate";
import BaptismalClass from "./pages/BaptismalClass";
import BaptismalScheduling from "./pages/BaptismalScheduling";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminMinistries from "./pages/admin/Ministries.jsx";
import AdminDonations from "./pages/admin/donations";
import AdminCollections from "./pages/admin/collection";
import SecretaryLayout from "./components/secretary/SecretaryLayout.jsx";
import SecretaryDashboard from "./pages/secretary/SecretaryDashboard.jsx";
import ScheduleMass from "./pages/secretary/ScheduleMass.jsx";
import VerifyAttendance from "./pages/secretary/VerifyAttendance.jsx";

// Wrapper for public pages
export const PublicPageWrapper = ({ children }) => (
  <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
    <Header />
    <Box sx={{ paddingTop: "64px" }}>{children}</Box>
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (!user) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has Administrative Pastor role
  const hasAdminRole = user.role === "Administrative Pastor";

  if (!hasAdminRole) {
    // User doesn't have admin role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const SecretaryRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has Secretary or Administrative Pastor role
  const hasSecretaryRole =
    user.role === "Secretary" || user.role === "Administrative Pastor";

  if (!hasSecretaryRole) {
    // User doesn't have secretary role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // User is already authenticated, redirect based on role
    if (user.role === "Administrative Pastor") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "Secretary") {
      return <Navigate to="/secretary" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicPageWrapper>
            <LandingPage />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/about-us"
        element={
          <PublicPageWrapper>
            <AboutUs />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/our-team"
        element={
          <PublicPageWrapper>
            <OurTeam />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/our-program"
        element={
          <PublicPageWrapper>
            <OurProgram />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/events"
        element={
          <PublicPageWrapper>
            <Events />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/visit-us"
        element={
          <PublicPageWrapper>
            <VisitUs />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/schedule"
        element={
          <PublicPageWrapper>
            <MassAndEventSchedule />
          </PublicPageWrapper>
        }
      />
      <Route
        path="/donate"
        element={
          <PublicPageWrapper>
            <Donate />
          </PublicPageWrapper>
        }
      />

      {/* Authentication routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <PublicPageWrapper>
              <Login />
            </PublicPageWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <PublicPageWrapper>
              <Register />
            </PublicPageWrapper>
          </PublicRoute>
        }
      />

      {/* Protected Routes - Member Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="mass-attendance" element={<MassAttendance />} />
        <Route path="ministry/apply" element={<ApplicationForMinistry />} />
        <Route path="ministry/my-ministries" element={<MyMinistries />} />
        <Route
          path="ministry/contacts"
          element={<ApplicationMinistryContacts />}
        />
        <Route
          path="baptismal-certificate"
          element={<BaptismalCertificate />}
        />
        <Route path="baptismal-class" element={<BaptismalClass />} />
        <Route path="baptismal-scheduling" element={<BaptismalScheduling />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="ministries" element={<AdminMinistries />} />
        <Route path="donations" element={<AdminDonations />} />
        <Route path="collections" element={<AdminCollections />} />
      </Route>

      {/* Secretary Routes */}
      <Route
        path="/secretary/*"
        element={
          <SecretaryRoute>
            <SecretaryLayout />
          </SecretaryRoute>
        }
      >
        <Route index element={<SecretaryDashboard />} />
        <Route path="schedule-mass" element={<ScheduleMass />} />
        <Route path="verify-attendance" element={<VerifyAttendance />} />
      </Route>

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
