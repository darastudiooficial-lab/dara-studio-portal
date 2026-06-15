import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], portalType = 'client' }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0a1e', color: '#6366f1' }}>
        <div className="loader">Loading Session...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?portal=${portalType}`} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to their default portal if they try to access a route they don't have access to
    const defaultPath = profile.role === 'admin' ? '/admin' : (profile.role === 'collaborator' ? '/collaborator' : '/portal');
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
