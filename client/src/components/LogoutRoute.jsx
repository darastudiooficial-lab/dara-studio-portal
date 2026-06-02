import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutRoute = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      setTimeout(() => {
        window.location.href = '/login?portal=client';
      }, 100);
    };
    handleLogout();
  }, [logout]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutRoute;
