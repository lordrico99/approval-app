import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";
import PrivateRoute from "./components/PrivateRoute";
import NewRequest from "./pages/NewRequest";
import MyRequests from "./pages/MyRequests";
import AppRedirect from "./components/AppRedirect";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Default login route */}
      <Route path="/" element={<Login />} />

      {/* Redirect logic after login, for role-based navigation */}
      <Route
        path="/redirect"
        element={
          <PrivateRoute>
            <AppRedirect />
          </PrivateRoute>
        }
      />

      {/* Protected user routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/request"
        element={
          <PrivateRoute>
            <NewRequest />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <PrivateRoute>
            <MyRequests />
          </PrivateRoute>
        }
      />
      <Route path="/approvals" element={<Approvals key={Date.now()} />} />


      {/* Protected admin route */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
