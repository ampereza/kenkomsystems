import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import MainDashboard from "./pages/MainDashboard";

// Auth
import AddUser from "./pages/authentication/adduser";
import RemoveUser from "./pages/authentication/removeuser";

// Dashboards
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "./pages/dashboards/TreatmentDashboardWrapper";

// Finance
import Receipts from "./pages/finance/Receipts";
import Expenses from "./pages/finance/Expenses";
import Employees from "./pages/finance/Employees";
import PaymentVouchers from "./pages/finance/PaymentVouchers";
import BalanceSheetPage from "./pages/finance/balancesheet";
import IncomeStatementPage from "./pages/finance/incomestatement";

// Customers
import Customers from "./pages/customers/customers";
import AddCustomer from "./pages/customers/add_customer";
import EditCustomer from "./pages/customers/edit_cutomers";

// Clients
import clients from "./pages/clients/clients";
import AddClientStock from "./pages/clients/add_clients_stock";
import EditClient from "./pages/clients/edit_client";
import ViewClientStock from "./pages/clients/view_clients_stock";
import InsertClientStock from "./pages/clients/insertclientsstock";

// Stock
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import StockReport from "./pages/stock/StockReport";
import SupplierReport from "./pages/suppliers/SupplierReport";
import ViewSuppliers from "./pages/suppliers/view_suppliers";
import AddSuppliers from "./pages/suppliers/add_suppliers";
import RejectedPoles from "./pages/suppliers/rejected_poles";

// Treatments
import TreatmentLog from "./pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "./pages/treatments/treatment_report";

// Reports
import EmployeeReport from "./pages/reports/EmployeeReport";
import GeneralLedger from "./pages/finance/GeneralLedger";
import FinancialReport from "./pages/finance/FinancialReport";

// Lazy loaded components
const Transactions = lazy(() => import("./pages/finance/Transactions"));

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
  }
];

// Stock routes
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
  }
];

// Treatment routes
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

// Initialize QueryClient
const queryClient = new QueryClient();

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route
            path="/maindashboard"
            element={
              <ProtectedRoute allowedRoles={["developer", "general_manager", "managing_director"]}>
                <MainDashboard />
              </ProtectedRoute>
            }
          />

          {/* Lazy loaded routes */}
          <Route 
            path="/finance/transactions" 
            element={
              <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager", "developer"]}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Transactions />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          {/* Dynamic dashboard routes */}
          {dashboardRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Customer routes */}
          {customerRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Admin routes */}
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Finance routes */}
          {financeRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Stock routes */}
          {stockRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Treatment routes */}
          {treatmentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.roles}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Clients routes */}
          <Route
            path="/clients"
            element={<Navigate to="/clients/list" replace />}
          />
          <Route
            path="/clients/list"
            element={<clients.ClientsList />}
          />
          <Route
            path="/clients/add"
            element={<clients.AddClient />}
          />
          <Route
            path="/clients/edit/:id"
            element={<clients.EditClient />}
          />
          <Route
            path="/clients/stock"
            element={<clients.ClientStock />}
          />
          <Route
            path="/clients/add-stock"
            element={<clients.AddClientStock />}
          />
          <Route
            path="/clients/view-stock/:id"
            element={<clients.ViewClientStock />}
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
