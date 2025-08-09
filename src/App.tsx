import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RouteGuard from './components/RouteGuard';
import Navbar from './components/Navbar';
import { routes } from './config/routes';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

// Loading component for lazy-loaded routes
const RouteLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {routes.map((route) => {
                const RouteElement = route.element;

                // Determine which wrapper to use based on route configuration
                if (route.requireGuest) {
                  // Guest-only routes
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <PublicRoute redirectTo={route.redirectTo}>
                          <RouteElement />
                        </PublicRoute>
                      }
                    />
                  );
                } else if (route.requireAuth) {
                  // Protected routes
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <RouteGuard
                          requireAuth
                          requiredRole={route.requiredRole}
                          allowedRoles={route.allowedRoles}
                          fallbackPath={route.fallbackPath}
                        >
                          {route.showNavbar ? (
                            <>
                              <Navbar />
                              <RouteElement />
                            </>
                          ) : (
                            <RouteElement />
                          )}
                        </RouteGuard>
                      }
                    />
                  );
                } else {
                  // Public routes
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.showNavbar ? (
                          <>
                            <Navbar />
                            <RouteElement />
                          </>
                        ) : (
                          <RouteElement />
                        )
                      }
                    />
                  );
                }
              })}

              {/* 404 route */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a
                        href="/"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Go back home
                      </a>
                    </div>
                  </div>
                </>
              } />
            </Routes>
          </Suspense>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;