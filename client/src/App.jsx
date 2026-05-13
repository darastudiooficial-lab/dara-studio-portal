import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import Process from './pages/Process';
import IPNotice from './pages/IPNotice';
import EstimateWizard from './pages/EstimateWizard';
import Login from './pages/Login';
import ClientPortal from './pages/ClientPortal';
import AdminPortal from './pages/AdminPortal';
import CollaboratorPortal from './pages/CollaboratorPortal';
import BackgroundOrbs from './components/BackgroundOrbs';
import VeraAssistant from './components/VeraAssistant';
import EstimateModal from './components/EstimateModal';
import { useAppContext } from './context/AppContext';
import './index.css';

function App() {
  // Forced re-render trigger for UI synchronization - v3
  const version = useMemo(() => Date.now(), []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isEstimateModalOpen, closeEstimateModal } = useAppContext();

  return (
    <AuthProvider>
      <BackgroundOrbs />
      <VeraAssistant />
      <EstimateModal isOpen={isEstimateModalOpen} onClose={closeEstimateModal} />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/team" element={<Team />} />
          <Route path="/process" element={<Process />} />
          <Route path="/ip-notice" element={<IPNotice />} />
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
  );
}

export default App;
