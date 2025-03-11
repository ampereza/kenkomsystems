
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import { DashboardRedirect } from "@/components/navigation/DashboardRedirect";
import FinancialDashboard from "@/pages/dashboards/FinancialDashboard";
import GeneralManagerDashboard from "@/pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "@/pages/dashboards/MDDashboard";
import StockDashboard from "@/pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "@/pages/dashboards/TreatmentDashboardWrapper";

export const DashboardRoutes = () => {
  return (
    <Route path="/dashboards">
      <Route index element={<DashboardRedirect />} />
      <Route path="financial" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <FinancialDashboard />
        </ProtectedRoute>
      } />
      <Route path="general-manager" element={
        <ProtectedRoute allowedRoles={["general_manager", "managing_director"]}>
          <GeneralManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="md" element={
        <ProtectedRoute allowedRoles={["managing_director"]}>
          <MDDashboard />
        </ProtectedRoute>
      } />
      <Route path="stock" element={
        <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
          <StockDashboard />
        </ProtectedRoute>
      } />
      <Route path="treatment" element={
        <ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}>
          <TreatmentDashboardWrapper />
        </ProtectedRoute>
      } />
    </Route>
  );
};

