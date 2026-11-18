import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const { currentRole } = useApp();
  const location = useLocation();

  if (!currentRole) {
    // Redirect to the appropriate login page based on intended portal
    const loginPath = `/${allowedRole}/login`;
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (currentRole !== allowedRole) {
    // User is logged in as another role! Block cross-portal access
    const destination = `/${currentRole}/dashboard`;
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
