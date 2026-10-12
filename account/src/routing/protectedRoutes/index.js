import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ element: Component }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    const canAccessRoute = (currentRoute, allowedRoutes) => {
        return allowedRoutes.some((allowedRoute) => currentRoute.startsWith(allowedRoute));
    };
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const businessAdminRoutes = [
        '/business-admin/dashboard-report',
    ];

    const clientAdminRoutes = [
        '/client-admin/dashboard-report',
    ];

    if (isAuthenticated) {
        if (userInfo.roleName === 'Business Administrator' && canAccessRoute(window.location.pathname, businessAdminRoutes)) {
            return <Component />;
        } else if (userInfo.roleName === 'Client Administrator' && canAccessRoute(window.location.pathname, clientAdminRoutes)) {
            return <Component />;
        } else {
            return <Navigate to="/error-page" />;
        }
    } else {
        return <Navigate to="/logout" />;
    }
};

export default ProtectedRoutes;