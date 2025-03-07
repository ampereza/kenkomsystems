
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

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

// Report pages
import GeneralLedger from "./pages/reports/GeneralLedger";
import FinancialReport from "./pages/reports/FinancialReport";
import EmployeeReport from "./pages/reports/EmployeeReport";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Dashboards */}
          <Route path="/dashboards">
            <Route path="financial" element={<FinancialDashboard />} />
            <Route path="general-manager" element={<GeneralManagerDashboard />} />
            <Route path="md" element={<MDDashboard />} />
            <Route path="stock" element={<StockDashboard />} />
            <Route path="treatments" element={<TreatmentDashboardWrapper />} />
          </Route>

          {/* Financial routes */}
          <Route path="/finance/transactions" element={<Transactions />} />
          <Route path="/finance/receipts" element={<Receipts />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/employees" element={<Employees />} />
          <Route path="/finance/payment-vouchers" element={<PaymentVouchers />} />

          {/* Report routes */}
          <Route path="/reports">
            <Route path="ledger" element={<GeneralLedger />} />
            <Route path="financial" element={<FinancialReport />} />
            <Route path="employees" element={<EmployeeReport />} />
          </Route>
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
