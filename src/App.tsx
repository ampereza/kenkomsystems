
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from 'react';

// Pages
import WelcomePage from "./pages/welcome/index";
import Login from "./pages/authentication/login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { EmailConfirmationHandler } from "./components/auth/EmailConfirmationHandler";

// Dashboards
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";

// Type definitions
import { UserRole } from "./components/auth/AuthProvider";

// Initialize QueryClient
const queryClient = new QueryClient();

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route
            path="/dashboards/gm"
            element={
              <ProtectedRoute allowedRoles={["general_manager", "managing_director", "developer"]}>
                <GeneralManagerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboards/md"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "developer"]}>
                <MDDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
