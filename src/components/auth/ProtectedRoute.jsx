import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(user.role)) {
        // If user's role is not in the allowed roles, redirect to home
        return <Navigate to="/" />;
    }

    return children;
}; 