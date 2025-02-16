
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import Unauthorized from "./pages/Unauthorized";
import ReceiveStock from "./pages/stock/ReceiveStock";
import SortStock from "./pages/stock/SortStock";
import Suppliers from "./pages/stock/Suppliers";
import ReceiveSortedStock from "./pages/stock/ReceiveSortedStock";
import RejectedPoles from "./pages/stock/RejectedPoles";
import Transactions from "./pages/finance/Transactions";
import Expenses from "./pages/finance/Expenses";
import Employees from "./pages/finance/Employees";
import FinancialReport from "./pages/reports/FinancialReport";
import StockReport from "./pages/reports/StockReport";
import SupplierReport from "./pages/reports/SupplierReport";
import EmployeeReport from "./pages/reports/EmployeeReport";
import GeneralLedger from "./pages/reports/GeneralLedger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* Stock Management Routes */}
            <Route path="/stock/receive" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <ReceiveStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/sort" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <SortStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/suppliers" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <Suppliers />
              </ProtectedRoute>
            } />
            <Route path="/stock/receive-sorted" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <ReceiveSortedStock />
              </ProtectedRoute>
            } />
            <Route path="/stock/rejected-poles" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <RejectedPoles />
              </ProtectedRoute>
            } />
            
            {/* Finance Routes */}
            <Route path="/finance/transactions" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'accountant']}>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/finance/expenses" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'accountant']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/finance/employees" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'accountant']}>
                <Employees />
              </ProtectedRoute>
            } />
            
            {/* Report Routes */}
            <Route path="/reports/financial" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'accountant']}>
                <FinancialReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/stock" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <StockReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/suppliers" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'stock_manager']}>
                <SupplierReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/employees" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director']}>
                <EmployeeReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/ledger" element={
              <ProtectedRoute allowedRoles={['general_manager', 'managing_director', 'accountant']}>
                <GeneralLedger />
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
