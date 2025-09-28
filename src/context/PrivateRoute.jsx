// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-green-900">
        <p className="text-white">Loading Data... </p>
        <ClipLoader
          size={70}
          color="#22c55e" // Tailwind's green-500
          // speedMultiplier={1} // optional: make it spin faster
          cssOverride={{
            borderWidth: '6px', // thicker line
          }}
        />
      </div>
    );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// import { useContext } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useContext(AuthContext);
//   const location = useLocation();

//   return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
// };

// export default PrivateRoute;
