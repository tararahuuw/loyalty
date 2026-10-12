import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const UserAccessGuard = ({ allowedRoles, children }) => {
  const location = useLocation();
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));

  if (!allowedRoles.includes(roleAccess)) {
    return <Navigate to="/prezent/not-authorized" state={{ from: location }} replace />;
  }

  return children;
};

export default UserAccessGuard;
