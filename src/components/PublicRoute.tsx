import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
    children: React.ReactNode;
    fallbackPath?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
    children,
    fallbackPath = '/'
}) => {
    const { isAuthenticated, isLoading } = useAuth();
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

    // Redirect to home if already authenticated
    if (isAuthenticated) {
        // Check if there's a redirect path from the location state
        const from = location.state?.from?.pathname || fallbackPath;
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute; 