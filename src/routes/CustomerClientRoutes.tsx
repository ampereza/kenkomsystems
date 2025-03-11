
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import Customers from "@/pages/customers/customers";
import AddCustomer from "@/pages/customers/add_customer";
import EditCustomer from "@/pages/customers/edit_cutomers";
import Clients from "@/pages/clients/clients";
import AddClientStock from "@/pages/clients/add_clients_stock";
import EditClient from "@/pages/clients/edit_client";
import ViewClientStock from "@/pages/clients/view_clients_stock";
import InsertClientStock from "@/pages/clients/insertclientsstock";

export const CustomerClientRoutes = () => {
  return (
    <>
      <Route path="/customers">
        <Route path="list" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="add" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <AddCustomer />
          </ProtectedRoute>
        } />
        <Route path="edit" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <EditCustomer />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/clients">
        <Route path="list" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="add-stock" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <AddClientStock />
          </ProtectedRoute>
        } />
        <Route path="edit" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <EditClient />
          </ProtectedRoute>
        } />
        <Route path="view-stock" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <ViewClientStock />
          </ProtectedRoute>
        } />
        <Route path="insert-stock" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <InsertClientStock />
          </ProtectedRoute>
        } />
      </Route>
    </>
  );
};

