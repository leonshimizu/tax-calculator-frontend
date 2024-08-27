// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("jwt"); // Check if the JWT exists in localStorage

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
