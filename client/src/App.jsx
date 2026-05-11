import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import EstimateWizard from './pages/EstimateWizard';
import Login from './pages/Login';
import ClientPortal from './pages/ClientPortal';
import AdminPortal from './pages/AdminPortal';
import CollaboratorPortal from './pages/CollaboratorPortal';
import BackgroundOrbs from './components/BackgroundOrbs';
import './index.css';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BackgroundOrbs />

        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/estimate" element={<EstimateWizard />} />
            <Route path="/login" element={<Login />} />

            {/* Client Portal - Role based guard */}
            <Route path="/portal/*" element={
              <ProtectedRoute allowedRoles={['client', 'admin']} portalType="client">
                <ClientPortal />
              </ProtectedRoute>
            } />

            {/* Admin Portal - Only for admins */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']} portalType="admin">
                <AdminPortal />
              </ProtectedRoute>
            } />

            {/* Collaborator Portal - Collaborators and Admins */}
            <Route path="/collaborator/*" element={
              <ProtectedRoute allowedRoles={['collaborator', 'admin']} portalType="collaborator">
                <CollaboratorPortal />
              </ProtectedRoute>
            } />

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/login?portal=client" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppProvider>

  );
}

export default App;
