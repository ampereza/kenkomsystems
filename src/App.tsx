
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
              <Route path="treatment" element={<TreatmentDashboardWrapper />} />
            </Route>

            {/* Financial routes */}
            <Route path="/finance">
              <Route path="transactions" element={<Transactions />} />
              <Route path="receipts" element={<Receipts />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="employees" element={<Employees />} />
              <Route path="payment-vouchers" element={<PaymentVouchers />} />
              <Route path="balance-sheet" element={<BalanceSheetPage />} />
              <Route path="income-statement" element={<IncomeStatementPage />} />
            </Route>

            {/* Customer routes */}
            <Route path="/customers">
              <Route path="list" element={<Customers />} />
              <Route path="add" element={<AddCustomer />} />
              <Route path="edit" element={<EditCustomer />} />
            </Route>

            {/* Client routes */}
            <Route path="/clients">
              <Route path="list" element={<Clients />} />
              <Route path="add-stock" element={<AddClientStock />} />
              <Route path="edit" element={<EditClient />} />
              <Route path="view-stock" element={<ViewClientStock />} />
              <Route path="insert-stock" element={<InsertClientStock />} />
            </Route>

            {/* Stock routes */}
            <Route path="/stock">
              <Route path="receive" element={<ReceiveStock />} />
              <Route path="sort" element={<SortStock />} />
              <Route path="report" element={<StockReport />} />
              <Route path="suppliers">
                <Route path="" element={<ViewSuppliers />} />
                <Route path="add" element={<AddSuppliers />} />
                <Route path="rejected" element={<RejectedPoles />} />
                <Route path="report" element={<SupplierReport />} />
              </Route>
            </Route>

            {/* Treatment routes */}
            <Route path="/treatment">
              <Route path="log" element={<TreatmentLog />} />
              <Route path="report" element={<TreatmentReport />} />
              <Route path="clients" element={<Clients />} />
              <Route path="stock" element={<ViewClientStock />} />
            </Route>

            {/* Report routes */}
            <Route path="/reports">
              <Route path="employees" element={<EmployeeReport />} />
              <Route path="ledger" element={<GeneralLedger />} />
              <Route path="financial" element={<FinancialReport />} />
            </Route>
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
