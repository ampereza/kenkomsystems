
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import AuthPage from "./pages/auth/AuthPage";
import UserManagement from "./pages/admin/UserManagement";

// Stock Management Routes
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import Suppliers from "./pages/stock/Suppliers";
import ReceiveSortedStock from "./pages/stock/ReceiveSortedStock";
import RejectedPoles from "./pages/stock/RejectedPoles";

// Finance Routes
import Transactions from "./pages/finance/Transactions";
import Expenses from "./pages/finance/Expenses";
import Employees from "./pages/finance/Employees";
import Documents from "./pages/finance/Documents";

// Report Routes
import FinancialReport from "./pages/reports/FinancialReport";
import StockReport from "./pages/reports/StockReport";
import SupplierReport from "./pages/reports/SupplierReport";
import EmployeeReport from "./pages/reports/EmployeeReport";
import GeneralLedger from "./pages/reports/GeneralLedger";

// Treatment Routes
import Clients from "./pages/treatments/Clients";
import TreatmentLogWrapper from "./pages/treatments/TreatmentLogWrapper";
import ClientStock from "./pages/treatments/ClientStock";

// Dashboard Routes
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "./pages/dashboards/TreatmentDashboardWrapper";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import TreatmentDashboard from "./pages/dashboards/TreatmentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            {/* Dashboard Routes */}
            <Route path="/dashboards/financial" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <FinancialDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboards/stock" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <StockDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboards/treatment" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'production_manager']}>
                <TreatmentDashboardWrapper />
              </ProtectedRoute>
            } />
            <Route path="/dashboards/general-manager" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager']}>
                <GeneralManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboards/md" element={
              <ProtectedRoute allowedRoles={['managing_director']}>
                <MDDashboard />
              </ProtectedRoute>
            } />
            
            {/* Stock Management Routes */}
            <Route path="/stock/receive" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <ReceiveStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/sort" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <SortStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/suppliers" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <Suppliers />
              </ProtectedRoute>
            } />
            <Route path="/stock/receive-sorted" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <ReceiveSortedStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/rejected-poles" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <RejectedPoles />
              </ProtectedRoute>
            } />
            
            {/* Finance Routes */}
            <Route path="/finance/transactions" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/finance/expenses" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/finance/employees" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <Employees />
              </ProtectedRoute>
            } />
            <Route path="/finance/documents" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <Documents />
              </ProtectedRoute>
            } />
            
            {/* Report Routes */}
            <Route path="/reports/financial" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <FinancialReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/stock" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager']}>
                <StockReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/suppliers" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'stock_manager', 'accountant']}>
                <SupplierReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/employees" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <EmployeeReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/ledger" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'accountant']}>
                <GeneralLedger />
              </ProtectedRoute>
            } />
          
            {/* Treatment Routes */}
            <Route path="/treatments/clients" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'production_manager']}>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/treatments/stock" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'production_manager']}>
                <ClientStock />
              </ProtectedRoute>
            } />
            <Route path="/treatment/operations" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'production_manager']}>
                <TreatmentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/treatment/log" element={
              <ProtectedRoute allowedRoles={['managing_director', 'general_manager', 'production_manager']}>
                <TreatmentLogWrapper />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
