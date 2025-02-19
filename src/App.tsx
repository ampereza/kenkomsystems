
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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
import Clients from "./pages/treatments/Clients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Stock Management Routes */}
          <Route path="/stock/receive" element={<ReceiveStock />} />
          <Route path="/stock/sort" element={<SortStock />} />
          <Route path="/stock/suppliers" element={<Suppliers />} />
          <Route path="/stock/receive-sorted" element={<ReceiveSortedStock />} />
          <Route path="/stock/rejected-poles" element={<RejectedPoles />} />
          
          {/* Finance Routes */}
          <Route path="/finance/transactions" element={<Transactions />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/employees" element={<Employees />} />
          
          {/* Report Routes */}
          <Route path="/reports/financial" element={<FinancialReport />} />
          <Route path="/reports/stock" element={<StockReport />} />
          <Route path="/reports/suppliers" element={<SupplierReport />} />
          <Route path="/reports/employees" element={<EmployeeReport />} />
          <Route path="/reports/ledger" element={<GeneralLedger />} />

          {/* Treatment Routes */}
          <Route path="/treatments/clients" element={<Clients />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
