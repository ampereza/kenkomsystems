import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute, UserRole } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WelcomePage from "./pages/welcome/index";
import Index from "./pages/Index";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Login from "./pages/authentication/login";
import AddUser from "./pages/authentication/adduser";
import RemoveUser from "./pages/authentication/removeuser";


// Auth
import { EmailConfirmationHandler } from "./components/auth/EmailConfirmationHandler";

// Dashboard 
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "./pages/dashboards/TreatmentDashboardWrapper";

// Financial pages
import Transactions from "./pages/finance/Transactions";
import Receipts from "./pages/finance/Receipts";
import Expenses from "./pages/finance/Expenses";
import Employees from "./pages/finance/Employees";
import PaymentVouchers from "./pages/finance/PaymentVouchers";
import BalanceSheetPage from "./pages/finance/balancesheet";
import IncomeStatementPage from "./pages/finance/incomestatement";

// Customer and Client pages
import Customers from "./pages/customers/customers";
import AddCustomer from "./pages/customers/add_customer";
import EditCustomer from "./pages/customers/edit_cutomers";
import Clients from "./pages/clients/clients";
import AddClientStock from "./pages/clients/add_clients_stock";
import EditClient from "./pages/clients/edit_client";
import ViewClientStock from "./pages/clients/view_clients_stock";
import InsertClientStock from "./pages/clients/insertclientsstock";

// Stock Pages
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import StockReport from "./pages/stock/StockReport";
import SupplierReport from "./pages/suppliers/SupplierReport";
import ViewSuppliers from "./pages/suppliers/view_suppliers";
import AddSuppliers from "./pages/suppliers/add_suppliers";
import RejectedPoles from "./pages/suppliers/rejected_poles";

// Treatment Pages
import TreatmentLog from "./pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "./pages/treatments/treatment_report";

// Report pages
import EmployeeReport from "./pages/reports/EmployeeReport";
import GeneralLedger from "./pages/reports/GeneralLedger";
import FinancialReport from "./pages/reports/FinancialReport";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

const ROUTE_ROLES: Record<string, UserRole[]> = {
  "/dashboards/financial": ["accountant", "managing_director", "general_manager"],
  "/dashboards/stock": ["stock_manager", "managing_director", "general_manager"],
  "/dashboards/treatment": ["production_manager", "managing_director", "general_manager"],
  "/admin/add-user": ["managing_director"],
  "/admin/remove-user": ["managing_director"],
};

function App() {
  return (
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

            {/* Protected routes - Finance */}
            <Route path="/finance">
              <Route path="transactions" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <Transactions />
                </ProtectedRoute>
              } />
              <Route path="receipts" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <Receipts />
                </ProtectedRoute>
              } />
              <Route path="expenses" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <Expenses />
                </ProtectedRoute>
              } />
              <Route path="employees" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="payment-vouchers" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <PaymentVouchers />
                </ProtectedRoute>
              } />
              <Route path="balance-sheet" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <BalanceSheetPage />
                </ProtectedRoute>
              } />
              <Route path="income-statement" element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  <IncomeStatementPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Protected routes - Dashboards */}
            <Route path="/dashboards">
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

            {/* Customer routes */}
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

            {/* Client routes */}
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

            {/* Stock routes */}
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

            {/* Treatment routes */}
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

            {/* Report routes */}
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
            <Route path="/admin/add-user" element={
              <ProtectedRoute allowedRoles={["managing_director"]}>
                <AddUser />
              </ProtectedRoute>
            } />
            <Route path="/admin/remove-user" element={
              <ProtectedRoute allowedRoles={["managing_director"]}>
                <RemoveUser />
              </ProtectedRoute>
            } />
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;