import { lazy } from "react";

// Lazy load components for better performance
const Home = lazy(() => import("../pages/Home"));
const VideoPlayer = lazy(() => import("../pages/VideoPlayer"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const UploadVideo = lazy(() => import("../pages/UploadVideo"));
const Profile = lazy(() => import("../pages/Profile"));
const Admin = lazy(() => import("../pages/Admin"));
const CreatorDashboard = lazy(() => import("../pages/CreatorDashboard"));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requireAuth?: boolean;
  requireGuest?: boolean;
  requiredRole?: "CREATOR" | "CONSUMER" | "ADMIN";
  allowedRoles?: ("CREATOR" | "CONSUMER" | "ADMIN")[];
  fallbackPath?: string;
  redirectTo?: string;
  showNavbar?: boolean;
  title?: string;
}

export const routes: RouteConfig[] = [
  // Public routes - accessible to everyone
  {
    path: "/",
    element: Home,
    showNavbar: true,
    title: "Home",
  },
  {
    path: "/video/:id",
    element: VideoPlayer,
    showNavbar: true,
    title: "Video Player",
  },

  // Guest-only routes - only accessible when NOT authenticated
  {
    path: "/login",
    element: Login,
    requireGuest: true,
    redirectTo: "/",
    title: "Login",
  },
  {
    path: "/signup",
    element: Signup,
    requireGuest: true,
    redirectTo: "/",
    title: "Sign Up",
  },

  // Protected routes - require authentication
  {
    path: "/upload",
    element: UploadVideo,
    requireAuth: true,
    requiredRole: "CREATOR",
    fallbackPath: "/login",
    showNavbar: true,
    title: "Upload Video",
  },
  {
    path: "/profile",
    element: Profile,
    requireAuth: true,
    allowedRoles: ["CREATOR", "CONSUMER", "ADMIN"],
    fallbackPath: "/login",
    showNavbar: true,
    title: "Profile",
  },
  {
    path: "/admin",
    element: Admin,
    requireAuth: true,
    requiredRole: "ADMIN",
    fallbackPath: "/login",
    showNavbar: true,
    title: "Admin Dashboard",
  },
  {
    path: "/creator-dashboard",
    element: CreatorDashboard,
    requireAuth: true,
    requiredRole: "CREATOR",
    fallbackPath: "/login",
    showNavbar: true,
    title: "Creator Dashboard",
  },
];

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find((route) => route.path === path);
};

// Helper function to check if route requires authentication
export const isRouteProtected = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requireAuth || false;
};

// Helper function to check if route is guest-only
export const isRouteGuestOnly = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requireGuest || false;
};
