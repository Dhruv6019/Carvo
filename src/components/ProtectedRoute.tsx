import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    allowGuest?: boolean;
}

export const ProtectedRoute = ({ children, allowedRoles, allowGuest = false }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>;
    }

    // If it's a guest-allowed route and the user is NOT authenticated, allow it.
    if (allowGuest && !isAuthenticated) {
        return <>{children}</>;
    }

    // If not authenticated (and not allowed as guest), redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, check roles if allowedRoles are specified
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Role not authorized - redirect to their specific dashboard
        const getDashboardLink = () => {
            switch (user.role) {
                case "admin": return "/admin";
                case "seller": return "/seller-dashboard";
                case "service_provider": return "/provider-dashboard";
                case "delivery_boy": return "/delivery-dashboard";
                case "support_agent": return "/support-dashboard";
                default: return "/dashboard";
            }
        };
        return <Navigate to={getDashboardLink()} replace />;
    }

    // If all checks pass, render children
    return <>{children}</>;
};
