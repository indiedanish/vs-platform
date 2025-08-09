import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireGuest?: boolean;
    requiredRole?: 'CREATOR' | 'CONSUMER' | 'ADMIN';
    allowedRoles?: ('CREATOR' | 'CONSUMER' | 'ADMIN')[];
    fallbackPath?: string;
    redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
    children,
    requireAuth = false,
    requireGuest = false,
    requiredRole,
    allowedRoles,
    fallbackPath = '/login',
    redirectTo
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

    // Handle guest-only routes (like login/signup)
    if (requireGuest && isAuthenticated) {
        const from = location.state?.from?.pathname || redirectTo || '/';
        return <Navigate to={from} replace />;
    }

    // Handle protected routes
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    // Handle role-based access control
    if (requireAuth && isAuthenticated && user) {
        // Check specific role requirement
        if (requiredRole && user.role !== requiredRole) {
            return <Navigate to="/" replace />;
        }

        // Check if user has any of the allowed roles
        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default RouteGuard; 