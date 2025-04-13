import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    // Redirect to the login page if the user is not logged in
    return <Navigate to="/profile" />;
  }

  return children; // Render the protected route's component if the user is logged in
};

export default ProtectedRoute;
