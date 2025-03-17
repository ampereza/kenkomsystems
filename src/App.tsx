
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from 'react';

// Pages
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Dashboards
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import TreatmentDashboard from "./pages/dashboards/TreatmentDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";

// Treatment pages
import TreatmentLogWrapper from "./pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "./pages/treatments/treatment_report";

// Stock pages
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import StockReport from "./pages/stock/StockReport";

// Supplier pages
import ViewSuppliers from "./pages/suppliers/view_suppliers";
import AddSuppliers from "./pages/suppliers/add_suppliers";
import RejectedPoles from "./pages/suppliers/rejected_poles";

// Finance pages
import GeneralLedger from "./pages/finance/GeneralLedger";
import PaymentVouchers from "./pages/finance/PaymentVouchers";
import Expenses from "./pages/finance/Expenses";
import Transactions from "./pages/finance/Transactions";
import Employees from "./pages/finance/Employees";
import Receipts from "./pages/finance/Receipts";
import IncomeStatement from "./pages/finance/incomestatement";

// Customer pages
import Customers from "./pages/customers/customers";
import EditCustomer from "./pages/customers/edit_cutomers";

// Reports
import EmployeeReport from "./pages/reports/EmployeeReport";

// Initialize QueryClient
const queryClient = new QueryClient();

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Set default route to MD dashboard */}
          <Route path="/" element={<Navigate to="/dashboards/md" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Dashboard routes */}
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
            path="/treatments/log"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "production_manager", "developer"]}>
                <TreatmentLogWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/treatments/report"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "production_manager", "developer"]}>
                <TreatmentReport />
              </ProtectedRoute>
            }
          />

          {/* Stock Routes */}
          <Route
            path="/stock/receive"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                <ReceiveStock />
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
          <Route
            path="/stock/report"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                <StockReport />
              </ProtectedRoute>
            }
          />

          {/* Supplier Routes */}
          <Route
            path="/stock/suppliers"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                <ViewSuppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock/suppliers/add"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                <AddSuppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock/rejected-poles"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "stock_manager", "developer"]}>
                <RejectedPoles />
              </ProtectedRoute>
            }
          />

          {/* Finance Routes */}
          <Route
            path="/finance/general-ledger"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                <GeneralLedger />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/payment-vouchers"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                <PaymentVouchers />
              </ProtectedRoute>
            }
          />
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
            path="/customers/customers"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/edit_cutomers"
            element={
              <ProtectedRoute allowedRoles={["managing_director", "general_manager", "accountant", "developer"]}>
                <EditCustomer />
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
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
