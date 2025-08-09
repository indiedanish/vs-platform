import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  routes,
  getRouteByPath,
  isRouteProtected,
  isRouteGuestOnly,
} from "../config/routes";

export const useRoutePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user can access a specific route
  const canAccessRoute = useCallback(
    (path: string): boolean => {
      const route = getRouteByPath(path);

      if (!route) return false;

      // Guest-only routes
      if (route.requireGuest) {
        return !isAuthenticated;
      }

      // Protected routes
      if (route.requireAuth) {
        if (!isAuthenticated) return false;

        // Check role requirements
        if (route.requiredRole && user?.role !== route.requiredRole) {
          return false;
        }

        if (route.allowedRoles && route.allowedRoles.length > 0) {
          return route.allowedRoles.includes(user?.role || "CONSUMER");
        }

        return true;
      }

      // Public routes
      return true;
    },
    [isAuthenticated, user]
  );

  // Navigate to a route with permission check
  const navigateToRoute = useCallback(
    (path: string) => {
      if (canAccessRoute(path)) {
        navigate(path);
      } else {
        // Redirect to appropriate fallback
        const route = getRouteByPath(path);
        if (route?.requireAuth) {
          navigate(route.fallbackPath || "/login", {
            state: { from: location },
          });
        } else if (route?.requireGuest) {
          navigate(route.redirectTo || "/");
        } else {
          navigate("/");
        }
      }
    },
    [canAccessRoute, navigate, location]
  );

  // Get all accessible routes for the current user
  const getAccessibleRoutes = useCallback(() => {
    return routes.filter((route) => canAccessRoute(route.path));
  }, [canAccessRoute]);

  // Check if current route requires authentication
  const isCurrentRouteProtected = useCallback(() => {
    return isRouteProtected(location.pathname);
  }, [location.pathname]);

  // Check if current route is guest-only
  const isCurrentRouteGuestOnly = useCallback(() => {
    return isRouteGuestOnly(location.pathname);
  }, [location.pathname]);

  return {
    canAccessRoute,
    navigateToRoute,
    getAccessibleRoutes,
    isCurrentRouteProtected,
    isCurrentRouteGuestOnly,
    currentPath: location.pathname,
  };
};
