import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Auth
import EmailConfirmationHandler from "./components/auth/EmailConfirmationHandler";

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

// Stock pages
import Stock from "./pages/stock/Stock";
import StockAdjustments from "./pages/stock/StockAdjustments";
import StockCategories from "./pages/stock/StockCategories";
import Suppliers from "./pages/stock/Suppliers";

// Treatment pages
import Treatments from "./pages/treatments/Treatments";
import TreatmentCategories from "./pages/treatments/TreatmentCategories";
import TreatmentRooms from "./pages/treatments/TreatmentRooms";
import TreatmentAppointments from "./pages/treatments/TreatmentAppointments";

// Employee pages
import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeSchedules from "./pages/employees/EmployeeSchedules";
import EmployeeAttendance from "./pages/employees/EmployeeAttendance";
import EmployeePayrolls from "./pages/employees/EmployeePayrolls";

// Report pages
import GeneralLedger from "./pages/reports/GeneralLedger";
import FinancialReport from "./pages/reports/FinancialReport";
import EmployeeReport from "./pages/reports/EmployeeReport";

// Settings pages
import GeneralSettings from "./pages/settings/GeneralSettings";
import TreatmentSettings from "./pages/settings/TreatmentSettings";
import StockSettings from "./pages/settings/StockSettings";
import EmployeeSettings from "./pages/settings/EmployeeSettings";
import { Toaster } from "@/components/ui/toaster"

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

          {/* Stock routes */}
          <Route path="/stock">
            <Route path="items" element={<Stock />} />
            <Route path="adjustments" element={<StockAdjustments />} />
            <Route path="categories" element={<StockCategories />} />
            <Route path="suppliers" element={<Suppliers />} />
          </Route>

          {/* Treatment routes */}
          <Route path="/treatments">
            <Route path="list" element={<Treatments />} />
            <Route path="categories" element={<TreatmentCategories />} />
            <Route path="rooms" element={<TreatmentRooms />} />
            <Route path="appointments" element={<TreatmentAppointments />} />
          </Route>

          {/* Employee routes */}
          <Route path="/employees">
            <Route path="list" element={<EmployeeList />} />
            <Route path="schedules" element={<EmployeeSchedules />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="payrolls" element={<EmployeePayrolls />} />
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

          {/* Settings routes */}
          <Route path="/settings">
            <Route path="general" element={<GeneralSettings />} />
            <Route path="treatments" element={<TreatmentSettings />} />
            <Route path="stock" element={<StockSettings />} />
            <Route path="employees" element={<EmployeeSettings />} />
          </Route>
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
