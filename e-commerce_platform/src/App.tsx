import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext.js";
import { CartProvider } from "./contexts/CartContext.js";

// Routes Guards
import ProtectedRoute from "./components/ProtectedRoute.js";
import AdminRoute from "./components/AdminRoute.js";

// Trackers
import { useVisitorTracker } from "./hooks/useVisitorTracker.js";

// Storefront Pages
import Index from "./pages/Index.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import VerifyEmail from "./pages/VerifyEmail.js";
import Profile from "./pages/Profile.js";
import Wishlist from "./pages/Wishlist.js";
import Checkout from "./pages/Checkout.js";
import Orders from "./pages/Orders.js";
import OrderDetails from "./pages/OrderDetails.js";
import Settings from "./pages/Settings.js";
import NotFound from "./pages/NotFound.js";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/Dashboard.js";
import AdminProducts from "./pages/admin/Products.js";
import AdminCategories from "./pages/admin/Categories.js";
import AdminOrders from "./pages/admin/Orders.js";
import AdminCoupons from "./pages/admin/Coupons.js";
import AdminUsers from "./pages/admin/Users.js";

const queryClient = new QueryClient();

// Inline tracker binder to run on route transitions
const RouteTracker = () => {
  useVisitorTracker();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <RouteTracker />
            <Routes>
              {/* Public Storefront */}
              <Route path="/" element={<Index />} />
              
              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Secure Shopper Dashboard */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              {/* Admin Panel Dashboard */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

