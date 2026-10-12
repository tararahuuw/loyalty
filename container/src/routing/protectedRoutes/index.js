import React from "react";
import { Navigate } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../../state/redux";
import { connect } from "react-redux";

const ProtectedRoutes = ({ userInfo, element }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  const canAccessRoute = (currentRoute, allowedRoutes) => {
    return allowedRoutes.some((allowedRoute) => currentRoute.startsWith(allowedRoute));
  };

  const systemAdministratorRoutes = [
    // User Management
    "/prezent/account/user",
    "/prezent/account/user/add",
    "/prezent/account/user/edit",

    // Client Management
    "/prezent/account/client",
    "/prezent/account/client/add",
    "/prezent/account/client/edit",

    // Division Management
    "/prezent/account/division",
    "/prezent/account/division/add",
    "/prezent/account/division/edit",
  ];

  const opsAdministratorRoutes = [
    // User Management
    "/prezent/account/user",
    "/prezent/account/user/add",
    "/prezent/account/user/edit",

    // Client Management
    "/prezent/account/client",
    "/prezent/account/client/add",
    "/prezent/account/client/edit",

    // Division Management
    "/prezent/account/division",
    "/prezent/account/division/add",
    "/prezent/account/division/edit",
  ];

  const businessAdministratorRoutes = [
    // User Management
    "/prezent/account/user",
    "/prezent/account/user/add",
    "/prezent/account/user/edit",

    // Client Management
    "/prezent/account/client",
    "/prezent/account/client/add",
    "/prezent/account/client/edit",

    // Division Management
    "/prezent/account/division",
    "/prezent/account/division/add",
    "/prezent/account/division/edit",
  ];

  const businessSupportRoutes = [
    // User Management
    "/prezent/account/user",
    "/prezent/account/user/add",
    "/prezent/account/user/edit",

    // Client Management
    "/prezent/account/client",
    "/prezent/account/client/add",
    "/prezent/account/client/edit",

    // Division Management
    "/prezent/account/division",
    "/prezent/account/division/add",
    "/prezent/account/division/edit",
  ];

  const clientAdministratorRoutes = [
    // User Management
    "/prezent/account/user",
    "/prezent/account/user/add",
    "/prezent/account/user/edit",

    // Client Management
    "/prezent/account/client",
    "/prezent/account/client/add",
    "/prezent/account/client/edit",

    // Division Management
    "/prezent/account/division",
    "/prezent/account/division/add",
    "/prezent/account/division/edit",
  ];

  const clientSupportRoutes = [
    // User Management
    "/prezent/account/user",

    // Client Management
    "/prezent/account/client",

    // Division Management
    "/prezent/account/division",
  ];

  if (isAuthenticated) {
    if (userInfo.roleName === "System Administrator" && canAccessRoute(window.location.pathname, systemAdministratorRoutes)) {
      return element;
    }
    else if (userInfo.roleName === "Ops Administrator" && canAccessRoute(window.location.pathname, opsAdministratorRoutes)) {
      return element;
    } 
    else if (userInfo.roleName === "Business Administrator" && canAccessRoute(window.location.pathname, businessAdministratorRoutes)) {
      return element;
    } 
    else if (userInfo.roleName === "Business Support" && canAccessRoute(window.location.pathname, businessSupportRoutes)) {
      return element;
    } 
    else if (userInfo.roleName === "Client Administrator" && canAccessRoute(window.location.pathname, clientAdministratorRoutes)) {
      return element;
    } 
    else if (userInfo.roleName === "Client Support" && canAccessRoute(window.location.pathname, clientSupportRoutes)) {
      return element;
    } else {
      return <Navigate to="/error-page" />;
    }
  } else {
    return <Navigate to="/" />;
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoutes);
