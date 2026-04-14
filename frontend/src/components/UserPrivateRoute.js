import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const UserPrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/user-login" />;
  }

  const user = getUser();
  
  // Only allow user role to access user panel
  if (user && user.role === 'user') {
    return children;
  }
  
  // If admin tries to access user routes, redirect to admin dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <Navigate to="/user-login" />;
};

export default UserPrivateRoute;