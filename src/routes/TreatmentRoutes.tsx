
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import TreatmentLog from "@/pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "@/pages/treatments/treatment_report";
import Clients from "@/pages/clients/clients";
import ViewClientStock from "@/pages/clients/view_clients_stock";

export const TreatmentRoutes = () => {
  return (
    <Route path="/treatment">
      <Route path="log" element={
        <ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}>
          <TreatmentLog />
        </ProtectedRoute>
      } />
      <Route path="report" element={
        <ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}>
          <TreatmentReport />
        </ProtectedRoute>
      } />
      <Route path="clients" element={
        <ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="stock" element={
        <ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}>
          <ViewClientStock />
        </ProtectedRoute>
      } />
    </Route>
  );
};

