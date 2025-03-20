
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Main Dashboard
import MainDashboard from "./pages/MainDashboard";

// Dashboards
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import TreatmentDashboard from "./pages/dashboards/TreatmentDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentLog from "./pages/dashboards/TreatmentLog";

// Stock pages
import StockReport from "./pages/dashboards/StockReport";
import SortStock from "./pages/stock/SortStock";

// Supplier pages
import ViewSuppliers from "./pages/dashboards/view_suppliers";
import AddSuppliers from "./pages/dashboards/add_suppliers";

// Customer pages
import Customers from "./pages/customers/customers";
import EditCustomer from "./pages/customers/edit_cutomers";
import AddCustomer from "./pages/customers/add_customer";

// Client pages
import Clients from "./pages/clients/clients";
import EditClient from "./pages/clients/edit_client";
import AddClientsStock from "./pages/clients/add_clients_stock";
import ViewClientsStock from "./pages/clients/view_clients_stock";

// Reports
import EmployeeReport from "./pages/dashboards/EmployeeReport";
import FinancialReport from "./pages/dashboards/FinancialReport";

// Finance pages
import Expenses from "./pages/dashboards/Expenses";
import Transactions from "./pages/dashboards/Transactions";
import Employees from "./pages/dashboards/Employees";
import Receipts from "./pages/dashboards/Receipts";
import IncomeStatement from "./pages/dashboards/incomestatement";

// Admin pages
import UserManagement from "./pages/admin/UserManagement";

// Initialize QueryClient
const queryClient = new QueryClient();

// Main App component
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Set default route to MD dashboard */}
              <Route path="/" element={<Navigate to="/dashboards/md" replace />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Main Dashboard */}
              <Route path="/dashboard" element={<MainDashboard />} />

              {/* Dashboard routes */}
              <Route
                path="/dashboards/financial"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <FinancialDashboard />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/dashboards/treatment"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "production_manager", "developer"]}>
                    <TreatmentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboards/stock"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <StockDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Treatment Routes */}
              <Route
                path="/treatment/log"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "production_manager", "developer"]}>
                    <TreatmentLog />
                  </ProtectedRoute>
                }
              />

              {/* Stock Routes */}
              <Route
                path="/stock/report"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <StockReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock/sort"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <SortStock />
                  </ProtectedRoute>
                }
              />

              {/* Supplier Routes */}
              <Route
                path="/suppliers/view-suppliers"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <ViewSuppliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/add"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <AddSuppliers />
                  </ProtectedRoute>
                }
              />

              {/* Client Routes */}
              <Route
                path="/clients"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Clients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <EditClient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/stock"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <ViewClientsStock />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/stock/add"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                    <AddClientsStock />
                  </ProtectedRoute>
                }
              />

              {/* Finance Routes */}
              <Route
                path="/finance/expenses"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/transactions"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/employees"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/receipts"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Receipts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/income-statement"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <IncomeStatement />
                  </ProtectedRoute>
                }
              />

              {/* Customer Routes */}
              <Route
                path="/customers/list"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <EditCustomer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/add"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <AddCustomer />
                  </ProtectedRoute>
                }
              />

              {/* Report Routes */}
              <Route
                path="/reports/employees"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <EmployeeReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/financial"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <FinancialReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/stock"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <StockReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/supplier-report"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                    <ViewSuppliers />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["managing_director", "general_manager", "developer"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
