// File path: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Components
import Header from './components/common/Header.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Auth Pages
import Login from './pages/Auth/Login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';

// Dashboard Pages
import { Workers, Alerts, Reports, Analysis, FlagReasons, Departments, Incidents } from './pages/Dashboard/DashboardPages.jsx';


const DashboardLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100 font-inter">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
);


export default function App() {
  const { user } = useAuth();
  
  // Decide the base redirect based on auth status
  const isAuthenticated = user && (user.role === 'supervisor' || user.role === 'admin');

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard/workers" : "/auth/login"} />} />
        <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/dashboard/workers" /> : <Login />} />
        <Route path="/auth/signup" element={isAuthenticated ? <Navigate to="/dashboard/workers" /> : <SignUp />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/*" element={<ProtectedRoute component={DashboardRoutes} />} />

        {/* Catch-all for not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Sub-component for dashboard routes to use the layout
const DashboardRoutes = () => (
    <DashboardLayout>
        <Routes>
            <Route path="workers" element={<Workers />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="flag-reasons" element={<FlagReasons />} />
            <Route path="departments" element={<Departments />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="*" element={<Navigate to="workers" />} />
        </Routes>
    </DashboardLayout>
);