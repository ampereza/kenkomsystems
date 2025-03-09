
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

// Customer and Client pages
import Customers from "./pages/customers/customers";
import AddCustomer from "./pages/customers/add_customer";
import EditCustomer from "./pages/customers/edit_cutomers";
import Clients from "./pages/clients/clients";
import AddClientStock from "./pages/clients/add_clients_stock";
import EditClient from "./pages/clients/edit_client";
import ViewClientStock from "./pages/clients/view_clients_stock";
import InsertClientStock from "./pages/clients/insertclientsstock";

// Report pages
import EmployeeReport from "./pages/reports/EmployeeReport";
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
              <Route path="treatments" element={<TreatmentDashboardWrapper />} />
            </Route>

            {/* Financial routes */}
            <Route path="/finance/transactions" element={<Transactions />} />
            <Route path="/finance/receipts" element={<Receipts />} />
            <Route path="/finance/expenses" element={<Expenses />} />
            <Route path="/finance/employees" element={<Employees />} />
            <Route path="/finance/payment-vouchers" element={<PaymentVouchers />} />

            {/* Customer routes */}
            <Route path="/customers/customers" element={<Customers />} />
            <Route path="/customers/add_customer" element={<AddCustomer />} />
            <Route path="/customers/edit_cutomers" element={<EditCustomer />} />

            {/* Client routes */}
            <Route path="/clients/clients" element={<Clients />} />
            <Route path="/clients/add_clients_stock" element={<AddClientStock />} />
            <Route path="/clients/edit_client" element={<EditClient />} />
            <Route path="/clients/view_clients_stock" element={<ViewClientStock />} />
            <Route path="/clients/insertclientsstock" element={<InsertClientStock />} />

            {/* Report routes */}
            <Route path="/reports">
              <Route path="employees" element={<EmployeeReport />} />
            </Route>
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
