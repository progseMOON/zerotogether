import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { role } = useContext(AuthContext);

    if (!role || (roles && !roles.includes(role))) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
