
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import SortStock from "./pages/stock/SortStock";
import UserManagement from "./pages/admin/UserManagement";
import Index from "./pages/Index";
import Login from "./pages/authentication/login";
import Unauthorized from "./pages/Unauthorized";
import AddUser from "./pages/authentication/adduser";
import RemoveUser from "./pages/authentication/removeuser";
import AddClient from "./pages/clients/add_client";
import AddClientsStock from "./pages/clients/add_clients_stock";
import InsertClientsStock from "./pages/clients/insertclientsstock";
import ViewClientsStock from "./pages/clients/view_clients_stock";
import EditClient from "./pages/clients/edit_client";
import Clients from "./pages/clients/clients";
import StockDashboard from "./pages/dashboards/StockDashboard";
import TreatmentDashboardWrapper from "./pages/dashboards/TreatmentDashboard";
import FinancialDashboard from "./pages/dashboards/FinancialDashboard";
import FinancialReport from "./pages/dashboards/FinancialReport";
import Transactions from "./pages/dashboards/Transactions";
import IncomeStatement from "./pages/dashboards/incomestatement";
import MDDashboard from "./pages/dashboards/MDDashboard";
import GeneralManagerDashboard from "./pages/dashboards/GeneralManagerDashboard";
import Receipts from "./pages/dashboards/Receipts";
import Expenses from "./pages/dashboards/Expenses";
import Employees from "./pages/dashboards/Employees";
import FinancialOverview from "./pages/dashboards/FinancialOverview";
import { EmailConfirmationHandler } from "./components/auth/EmailConfirmationHandler";
import CustomersPage from "./pages/customers/CustomersPage";
import AddSuppliers from "./pages/suppliers/AddSuppliers";
import ViewSuppliers from "./pages/suppliers/ViewSuppliers"; 
import SupplierReport from "./pages/suppliers/SupplierReport";
import TreatmentLog from "./pages/treatments/TreatmentLog";
import MainDashboard from "./pages/MainDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/unauthorized" element={<Unauthorized />} />
          <Route path="/auth/confirm" element={<EmailConfirmationHandler />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/dashboards/stock" element={<StockDashboard />} />
          <Route path="/dashboards/treatment" element={<TreatmentDashboardWrapper />} />
          <Route path="/dashboards/financial" element={<FinancialDashboard />} />
          <Route path="/dashboards/financial-report" element={<FinancialReport />} />
          <Route path="/dashboards/financial-overview" element={<FinancialOverview />} />
          <Route path="/dashboards/transactions" element={<Transactions />} />
          <Route path="/dashboards/incomestatement" element={<IncomeStatement />} />
          <Route path="/dashboards/md" element={<MDDashboard />} />
          <Route path="/dashboards/gm" element={<GeneralManagerDashboard />} />
          
          {/* Finance routes */}
          <Route path="/finance/transactions" element={<Transactions />} />
          <Route path="/finance/receipts" element={<Receipts />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/employees" element={<Employees />} />
          <Route path="/finance/income-statement" element={<IncomeStatement />} />
          <Route path="/finance/overview" element={<FinancialOverview />} />
          
          {/* Client routes */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/add_clients_stock" element={<AddClientsStock />} />
          <Route path="/clients/insert_client_stock" element={<InsertClientsStock />} />
          <Route path="/clients/view" element={<ViewClientsStock />} />
          <Route path="/clients/edit" element={<EditClient />} />
          
          {/* Admin routes */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/add-user" element={<AddUser />} />
          <Route path="/admin/remove-user" element={<RemoveUser />} />
          
          {/* Stock routes */}
          <Route path="/stock/sort" element={<SortStock />} />
          
          {/* Customer routes */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/add" element={<CustomersPage />} />
          <Route path="/customers/edit" element={<CustomersPage />} />
          
          {/* Supplier routes */}
          <Route path="/suppliers/add" element={<AddSuppliers />} />
          <Route path="/suppliers/view-suppliers" element={<ViewSuppliers />} />
          <Route path="/suppliers/supplier-report" element={<SupplierReport />} />
          
          {/* Treatment routes */}
          <Route path="/treatment/log" element={<TreatmentLog />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
