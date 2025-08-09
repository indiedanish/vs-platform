import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'CREATOR' | 'CONSUMER' | 'ADMIN';
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    fallbackPath = '/login'
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    // Check role requirements if specified
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to home if user doesn't have required role
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 