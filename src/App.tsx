
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stock/receive" element={<ReceiveStock />} />
          <Route path="/stock/sort" element={<SortStock />} />
          <Route path="/stock/suppliers" element={<Suppliers />} />
          <Route path="/stock/receive-sorted" element={<ReceiveSortedStock />} />
          <Route path="/stock/rejected-poles" element={<RejectedPoles />} />
          <Route path="/finance/transactions" element={<Transactions />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/employees" element={<Employees />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
