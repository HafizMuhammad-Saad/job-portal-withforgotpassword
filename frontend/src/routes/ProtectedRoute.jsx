import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
//   const location = useLocation();
//   const user = { role: "employer" }; // Replace with your user authentication logic

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (user.role !== requiredRole) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

  return <Outlet />;
};

export default ProtectedRoute;
