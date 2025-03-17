
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

<<<<<<< HEAD
// Finance
import Receipts from "./pages/finance/Receipts";
import Expenses from "./pages/dashboards/Expenses";
import Employees from "./pages/dashboards/Employees";
import PaymentVouchers from "./pages/finance/PaymentVouchers";
import BalanceSheetPage from "./pages/dashboards/balancesheet";
import IncomeStatementPage from "./pages/dashboards/incomestatement";
=======
// Treatment pages
import TreatmentLogWrapper from "./pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "./pages/treatments/treatment_report";
>>>>>>> f08152ba21b220b1faf9db25c5f1287b1fbbf448

// Stock pages
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
<<<<<<< HEAD
import StockReport from "./pages/dashboards/StockReport";
import SupplierReport from "./pages/suppliers/SupplierReport";
import ViewSuppliers from "./pages/dashboards/view_suppliers";
import AddSuppliers from "./pages/dashboards/add_suppliers";
=======
import StockReport from "./pages/stock/StockReport";

// Supplier pages
import ViewSuppliers from "./pages/suppliers/view_suppliers";
import AddSuppliers from "./pages/suppliers/add_suppliers";
>>>>>>> f08152ba21b220b1faf9db25c5f1287b1fbbf448
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
<<<<<<< HEAD
import EmployeeReport from "./pages/dashboards/EmployeeReport";
import GeneralLedger from "./pages/finance/GeneralLedger";
import FinancialReport from "./pages/dashboards/FinancialReport";

// Lazy loaded components
const Transactions = lazy(() => import("./pages/dashboards/Transactions"));

// Type definitions
import { UserRole } from "./components/auth/AuthProvider";

// Route configurations
interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  roles: UserRole[];
}

// Define route configurations
const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboards/financial",
    component: FinancialDashboard,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/dashboards/general-manager",
    component: GeneralManagerDashboard,
    roles: ["general_manager", "managing_director", "developer"]
  },
  {
    path: "/dashboards/md",
    component: MDDashboard,
    roles: ["managing_director", "developer"]
  },
  {
    path: "/dashboards/stock",
    component: StockDashboard,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/dashboards/treatment",
    component: TreatmentDashboardWrapper,
    roles: ["production_manager", "managing_director", "general_manager", "developer"]
  }
];

const customerRoutes: RouteConfig[] = [
  {
    path: "/customers/list",
    component: Customers,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/customers/add",
    component: AddCustomer,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/customers/edit",
    component: EditCustomer,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  }
];

const adminRoutes: RouteConfig[] = [
  {
    path: "/admin/add-user",
    component: AddUser,
    roles: ["managing_director", "developer"]
  },
  {
    path: "/admin/remove-user",
    component: RemoveUser,
    roles: ["managing_director", "developer"]
  }
];

const financeRoutes: RouteConfig[] = [
  {
    path: "/finance/financialreport",
    component: FinancialReport,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/reports/employeereport",
    component: EmployeeReport,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/generalledger",
    component: GeneralLedger,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/receipts",
    component: Receipts,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/expenses",
    component: Expenses,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/employees",
    component: Employees,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/payment-vouchers",
    component: PaymentVouchers,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/balance-sheet",
    component: BalanceSheetPage,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/income-statement",
    component: IncomeStatementPage,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/finance/expense-authorizations",
    component: Expenses,
    roles: ["accountant", "managing_director", "general_manager", "developer"]
  }
];

const stockRoutes: RouteConfig[] = [
  {
    path: "/stock/receive",
    component: ReceiveStock,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/stock/sort",
    component: SortStock,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/stock/report",
    component: StockReport,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/reports/stock",
    component: StockReport,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  }
];

const supplierRoutes: RouteConfig[] = [
  {
    path: "/suppliers/view-suppliers",
    component: ViewSuppliers,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/suppliers/add",
    component: AddSuppliers,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/suppliers/rejected-poles",
    component: RejectedPoles,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/suppliers/supplier-report",
    component: SupplierReport,
    roles: ["stock_manager", "managing_director", "general_manager", "developer"]
  }
];

const treatmentRoutes: RouteConfig[] = [
  {
    path: "/treatment/log",
    component: TreatmentLog,
    roles: ["production_manager", "managing_director", "general_manager", "developer"]
  },
  {
    path: "/treatment/report",
    component: TreatmentReport,
    roles: ["production_manager", "managing_director", "general_manager", "developer"]
  }
];
=======
import EmployeeReport from "./pages/reports/EmployeeReport";
>>>>>>> f08152ba21b220b1faf9db25c5f1287b1fbbf448

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
