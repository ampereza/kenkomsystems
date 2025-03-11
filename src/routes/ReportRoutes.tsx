
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import EmployeeReport from "@/pages/reports/EmployeeReport";
import GeneralLedger from "@/pages/reports/GeneralLedger";
import FinancialReport from "@/pages/reports/FinancialReport";

export const ReportRoutes = () => {
  return (
    <Route path="/reports">
      <Route path="employees" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <EmployeeReport />
        </ProtectedRoute>
      } />
      <Route path="ledger" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <GeneralLedger />
        </ProtectedRoute>
      } />
      <Route path="financial" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <FinancialReport />
        </ProtectedRoute>
      } />
    </Route>
  );
};

