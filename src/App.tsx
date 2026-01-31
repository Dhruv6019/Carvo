import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { lazy, Suspense } from "react";

// Immediately load only the home page
import Index from "./pages/Index";

// Lazy load all other pages to reduce initial bundle size
const CarSelection = lazy(() => import("./pages/CarSelection"));
const ModificationHub = lazy(() => import("./pages/ModificationHub"));
const BookingService = lazy(() => import("./pages/BookingService"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const DeliveryDashboard = lazy(() => import("./pages/DeliveryDashboard"));
const SupportDashboard = lazy(() => import("./pages/SupportDashboard"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ThreeDView = lazy(() => import("./pages/ThreeDView"));
const Game = lazy(() => import("./pages/Game"));
const InvoiceView = lazy(() => import("./pages/InvoiceView"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiesSettings = lazy(() => import("./pages/CookiesSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Features = lazy(() => import("./pages/Features"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const Notifications = lazy(() => import("./pages/Notifications"));
import { LoadingScreen } from "./components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { useState, useEffect } from "react";

const queryClient = new QueryClient();

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(() => {
    // Check if we've already loaded in this session to prevent "looping" on refresh
    return !sessionStorage.getItem('carvo_loaded');
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('carvo_loaded', 'true');
    setIsAppLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID"}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {isAppLoading ? (
                <LoadingScreen duration={2500} onComplete={handleLoadingComplete} />
              ) : (
                <BrowserRouter>
                  <Suspense fallback={<LoadingScreen duration={1000} onComplete={() => { }} />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/car-selection" element={<ProtectedRoute allowedRoles={['customer']} allowGuest={true}><CarSelection /></ProtectedRoute>} />
                      <Route path="/customize" element={<ProtectedRoute allowedRoles={['customer']} allowGuest={true}><ModificationHub /></ProtectedRoute>} />
                      <Route path="/services" element={<ProtectedRoute allowedRoles={['customer']} allowGuest={true}><BookingService /></ProtectedRoute>} />

                      {/* Customer Sensitive Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><Dashboard /></ProtectedRoute>} />
                      <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
                      <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
                      <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['customer']}><Wishlist /></ProtectedRoute>} />
                      <Route path="/3d-view" element={<ProtectedRoute allowedRoles={['customer']}><ThreeDView /></ProtectedRoute>} />
                      <Route path="/game" element={<ProtectedRoute allowedRoles={['customer']}><Game /></ProtectedRoute>} />

                      {/* Management/Staff Dashboards */}
                      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
                      <Route path="/seller-dashboard" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>} />
                      <Route path="/provider-dashboard" element={<ProtectedRoute allowedRoles={['service_provider']}><ProviderDashboard /></ProtectedRoute>} />
                      <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRoles={['delivery_boy']}><DeliveryDashboard /></ProtectedRoute>} />
                      <Route path="/support-dashboard" element={<ProtectedRoute allowedRoles={['support_agent']}><SupportDashboard /></ProtectedRoute>} />

                      {/* Public facing pages */}
                      <Route path="/shop" element={<ProtectedRoute allowedRoles={['customer']} allowGuest={true}><Shop /></ProtectedRoute>} />
                      <Route path="/part/:id" element={<ProtectedRoute allowedRoles={['customer']} allowGuest={true}><ProductDetail /></ProtectedRoute>} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/invoice/:id" element={<InvoiceView />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/cookies" element={<CookiesSettings />} />
                      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['customer', 'seller', 'service_provider', 'delivery_boy', 'support_agent', 'admin']}><Notifications /></ProtectedRoute>} />

                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              )}
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
