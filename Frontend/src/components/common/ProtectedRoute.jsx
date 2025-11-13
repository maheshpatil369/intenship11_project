// File path: src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ component: Component }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Ensure only Supervisor or Admin can access the dashboard
  if (user.role !== 'supervisor' && user.role !== 'admin') {
    // Optionally redirect unauthorized roles (e.g., 'worker') to a specific page
    console.warn("User role is not authorized for dashboard access:", user.role);
    return <Navigate to="/auth/login" replace />; // Redirect back to login
  }

  return <Component />;
}