import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BuildersProvider } from './context/BuildersContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import HowWeWork from './pages/HowWeWork';
import IPNotice from './pages/IPNotice';
import EstimateWizard from './pages/EstimateWizard';
import Login from './pages/Login';
import LogoutRoute from './components/LogoutRoute';
import ClientPortal from './pages/ClientPortal';
import AdminPortal from './pages/AdminPortal';
import CollaboratorPortal from './pages/CollaboratorPortal';
import InteriorReference from './pages/InteriorReference';
import CodeInspector from './pages/CodeInspector';
import FieldGuide from './pages/FieldGuide';
import BackgroundOrbs from './components/BackgroundOrbs';
import VeraAssistant from './components/VeraAssistant';
import EstimateModal from './components/EstimateModal';
import { useAppContext } from './context/AppContext';
import './index.css';

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isEstimateModalOpen, closeEstimateModal } = useAppContext();

  return (
    <BuildersProvider>
    <AuthProvider>
      <BackgroundOrbs />
      <VeraAssistant />
      <EstimateModal isOpen={isEstimateModalOpen} onClose={closeEstimateModal} />

      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
    </BuildersProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/team" element={<Team />} />
        <Route path="/how-we-work" element={<HowWeWork />} />
        <Route path="/ip-notice" element={<IPNotice />} />
        <Route path="/estimate" element={<PageTransition><EstimateWizard /></PageTransition>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutRoute />} />
        <Route path="/interior-reference" element={
          <ProtectedRoute allowedRoles={['client', 'collaborator', 'admin']} portalType="client">
            <PageTransition><InteriorReference /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/code-inspector" element={
          <ProtectedRoute allowedRoles={['client', 'collaborator', 'admin']} portalType="client">
            <PageTransition><CodeInspector /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/field-guide" element={
          <ProtectedRoute allowedRoles={['client', 'collaborator', 'admin']} portalType="client">
            <PageTransition><FieldGuide /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Client Portal - Role based guard */}
        <Route path="/portal/*" element={
          <ProtectedRoute allowedRoles={['client']} portalType="client">
            <PageTransition variant="default"><ClientPortal /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Admin Portal - Only for admins */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']} portalType="admin">
            <PageTransition variant="default"><AdminPortal /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Collaborator Portal - Collaborators and Admins */}
        <Route path="/collaborator/*" element={
          <ProtectedRoute allowedRoles={['collaborator', 'admin']} portalType="collaborator">
            <PageTransition variant="default"><CollaboratorPortal /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login?portal=client" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
