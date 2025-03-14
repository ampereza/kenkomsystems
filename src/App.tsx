import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from 'react';
import React from 'react';


// Pages
import WelcomePage from "./pages/welcome/index";
import Login from "./pages/authentication/login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { EmailConfirmationHandler } from "./components/auth/EmailConfirmationHandler";
import MainDashboard from "./pages/MainDashboard"

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
import Clients from "./pages/clients/clients";
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
import GeneralLedger from "./pages/reports/GeneralLedger";
import FinancialReport from "./pages/reports/FinancialReport";

const queryClient = new QueryClient();
const Transactions = lazy(() => import("./pages/finance/Transactions"));


const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          <Route
          path="/maindashboard"
          element={
            <ProtectedRoute allowedRoles={["developer", "general_manager", "managing_director"]}>
              <MainDashboard />
            </ProtectedRoute>
          }
        />


          <Route path="/finance/transactions" element={
          <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
            <Suspense fallback={<div>Loading...</div>}>
              <Transactions />
            </Suspense>
          </ProtectedRoute>
        } />

          {/** Dashboards */}
          {['financial', 'general-manager', 'md', 'stock', 'treatment'].map((path, i) => (
            <Route key={i} path={`/dashboards/${path}`} element={
              <ProtectedRoute allowedRoles={getRolesForDashboard(path)}>
                {React.createElement(require(`./pages/dashboards/${capitalize(path)}Dashboard`).default)}
              </ProtectedRoute>
            } />
          ))}

          {/** Customers */}
          {['list', 'add', 'edit'].map((path, i) => (
            <Route key={i} path={`/customers/${path}`} element={
              <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                {React.createElement(require(`./pages/customers/${mapCustomerPath(path)}`).default)}
              </ProtectedRoute>
            } />
          ))}

          {/** Admin */}
          {['add-user', 'remove-user'].map((path, i) => (
            <Route key={i} path={`/admin/${path}`} element={
              <ProtectedRoute allowedRoles={["managing_director"]}>
                {React.createElement(require(`./pages/authentication/${mapAdminPath(path)}`).default)}
              </ProtectedRoute>
            } />
          ))}

        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const mapCustomerPath = (path: string) => path === 'list' ? 'customers' : `${path}_customer`;
const mapAdminPath = (path: string) => path.replace('-', '');
const getRolesForDashboard = (path: string) => {
  const roles: Record<string, string[]> = {
    financial: ["accountant", "managing_director", "general_manager"],
    "general-manager": ["general_manager", "managing_director"],
    md: ["managing_director"],
    stock: ["stock_manager", "managing_director", "general_manager"],
    treatment: ["production_manager", "managing_director", "general_manager"]
  };
  return roles[path] || [];
};

export default App;
