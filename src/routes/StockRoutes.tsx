
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import ReceiveStock from "@/pages/stock/ReceiveStock";
import SortStock from "@/pages/stock/SortStock";
import StockReport from "@/pages/stock/StockReport";
import ViewSuppliers from "@/pages/suppliers/view_suppliers";
import AddSuppliers from "@/pages/suppliers/add_suppliers";
import RejectedPoles from "@/pages/suppliers/rejected_poles";
import SupplierReport from "@/pages/suppliers/SupplierReport";

export const StockRoutes = () => {
  return (
    <Route path="/stock">
      <Route path="receive" element={
        <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
          <ReceiveStock />
        </ProtectedRoute>
      } />
      <Route path="sort" element={
        <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
          <SortStock />
        </ProtectedRoute>
      } />
      <Route path="report" element={
        <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
          <StockReport />
        </ProtectedRoute>
      } />
      <Route path="suppliers">
        <Route path="" element={
          <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
            <ViewSuppliers />
          </ProtectedRoute>
        } />
        <Route path="add" element={
          <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
            <AddSuppliers />
          </ProtectedRoute>
        } />
        <Route path="rejected" element={
          <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
            <RejectedPoles />
          </ProtectedRoute>
        } />
        <Route path="report" element={
          <ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
            <SupplierReport />
          </ProtectedRoute>
        } />
      </Route>
    </Route>
  );
};

