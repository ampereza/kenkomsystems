import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProtectedRoute, UserRole } from "./components/auth/AuthProvider";

// Public Pages
import WelcomePage from "./pages/welcome";
import Login from "./pages/authentication/login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import { EmailConfirmationHandler } from "./components/auth/EmailConfirmationHandler";

// Admin
import AddUser from "./pages/authentication/adduser";
import RemoveUser from "./pages/authentication/removeuser";

// Dashboards
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "./pages/dashboards/TreatmentDashboardWrapper";

// Finance
import Transactions from "./pages/finance/Transactions";
import Receipts from "./pages/finance/Receipts";
import Expenses from "./pages/finance/Expenses";
import Employees from "./pages/finance/Employees";
import PaymentVouchers from "./pages/finance/PaymentVouchers";
import BalanceSheetPage from "./pages/finance/balancesheet";
import IncomeStatementPage from "./pages/finance/incomestatement";

// Customers & Clients
import Customers from "./pages/customers/customers";
import AddCustomer from "./pages/customers/add_customer";
import EditCustomer from "./pages/customers/edit_cutomers";
import Clients from "./pages/clients/clients";
import AddClientStock from "./pages/clients/add_clients_stock";
import EditClient from "./pages/clients/edit_client";
import ViewClientStock from "./pages/clients/view_clients_stock";
import InsertClientStock from "./pages/clients/insertclientsstock";

// Stock & Suppliers
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import StockReport from "./pages/stock/StockReport";
import SupplierReport from "./pages/suppliers/SupplierReport";
import ViewSuppliers from "./pages/suppliers/view_suppliers";
import AddSuppliers from "./pages/suppliers/add_suppliers";
import RejectedPoles from "./pages/suppliers/rejected_poles";

// Treatment
import TreatmentLog from "./pages/treatments/TreatmentLogWrapper";
import TreatmentReport from "./pages/treatments/treatment_report";

// Reports
import EmployeeReport from "./pages/reports/EmployeeReport";
import GeneralLedger from "./pages/reports/GeneralLedger";
import FinancialReport from "./pages/reports/FinancialReport";

// UI
import { Toaster } from "@/components/ui/toaster";

// Query Client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />

            {/* Admin Routes */}
            <Route path="/admin/add-user" element={<ProtectedRoute allowedRoles={["managing_director"]}><AddUser /></ProtectedRoute>} />
            <Route path="/admin/remove-user" element={<ProtectedRoute allowedRoles={["managing_director"]}><RemoveUser /></ProtectedRoute>} />

            {/* Dashboards */}
            <Route path="/dashboards/financial" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><FinancialDashboard /></ProtectedRoute>} />
            <Route path="/dashboards/general-manager" element={<ProtectedRoute allowedRoles={["general_manager", "managing_director"]}><GeneralManagerDashboard /></ProtectedRoute>} />
            <Route path="/dashboards/md" element={<ProtectedRoute allowedRoles={["managing_director"]}><MDDashboard /></ProtectedRoute>} />
            <Route path="/dashboards/stock" element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}><StockDashboard /></ProtectedRoute>} />
            <Route path="/dashboards/treatment" element={<ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}><TreatmentDashboardWrapper /></ProtectedRoute>} />

            {/* Finance */}
            {["transactions", "receipts", "expenses", "employees", "payment-vouchers", "balance-sheet", "income-statement"].map((path) => (
              <Route key={path} path={`/finance/${path}`} element={
                <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                  {path === "transactions" && <Transactions />}
                  {path === "receipts" && <Receipts />}
                  {path === "expenses" && <Expenses />}
                  {path === "employees" && <Employees />}
                  {path === "payment-vouchers" && <PaymentVouchers />}
                  {path === "balance-sheet" && <BalanceSheetPage />}
                  {path === "income-statement" && <IncomeStatementPage />}
                </ProtectedRoute>
              } />
            ))}

            {/* Customers */}
            <Route path="/customers/list" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><Customers /></ProtectedRoute>} />
            <Route path="/customers/add" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><AddCustomer /></ProtectedRoute>} />
            <Route path="/customers/edit" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><EditCustomer /></ProtectedRoute>} />

            {/* Clients */}
            {["list", "add-stock", "edit", "view-stock", "insert-stock"].map((path) => (
              <Route key={path} path={`/clients/${path}`} element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
                {path === "list" && <Clients />}
                {path === "add-stock" && <AddClientStock />}
                {path === "edit" && <EditClient />}
                {path === "view-stock" && <ViewClientStock />}
                {path === "insert-stock" && <InsertClientStock />}
              </ProtectedRoute>} />
            ))}

            {/* Stock */}
            {["receive", "sort", "report"].map((path) => (
              <Route key={path} path={`/stock/${path}`} element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}>
                {path === "receive" && <ReceiveStock />}
                {path === "sort" && <SortStock />}
                {path === "report" && <StockReport />}
              </ProtectedRoute>} />
            ))}
            <Route path="/stock/suppliers" element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}><ViewSuppliers /></ProtectedRoute>} />
            <Route path="/stock/suppliers/add" element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}><AddSuppliers /></ProtectedRoute>} />
            <Route path="/stock/suppliers/rejected" element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}><RejectedPoles /></ProtectedRoute>} />
            <Route path="/stock/suppliers/report" element={<ProtectedRoute allowedRoles={["stock_manager", "managing_director", "general_manager"]}><SupplierReport /></ProtectedRoute>} />

            {/* Treatment */}
            <Route path="/treatment/log" element={<ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}><TreatmentLog /></ProtectedRoute>} />
            <Route path="/treatment/report" element={<ProtectedRoute allowedRoles={["production_manager", "managing_director", "general_manager"]}><TreatmentReport /></ProtectedRoute>} />

            {/* Reports */}
            <Route path="/reports/employees" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><EmployeeReport /></ProtectedRoute>} />
            <Route path="/reports/ledger" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><GeneralLedger /></ProtectedRoute>} />
            <Route path="/reports/financial" element={<ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}><FinancialReport /></ProtectedRoute>} />

          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
