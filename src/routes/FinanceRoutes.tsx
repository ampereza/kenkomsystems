
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import Transactions from "@/pages/finance/Transactions";
import Receipts from "@/pages/finance/Receipts";
import Expenses from "@/pages/finance/Expenses";
import Employees from "@/pages/finance/Employees";
import PaymentVouchers from "@/pages/finance/PaymentVouchers";
import BalanceSheetPage from "@/pages/finance/balancesheet";
import IncomeStatementPage from "@/pages/finance/incomestatement";

export const FinanceRoutes = () => {
  return (
    <Route path="/finance">
      <Route path="transactions" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="receipts" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <Receipts />
        </ProtectedRoute>
      } />
      <Route path="expenses" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <Expenses />
        </ProtectedRoute>
      } />
      <Route path="employees" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <Employees />
        </ProtectedRoute>
      } />
      <Route path="payment-vouchers" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <PaymentVouchers />
        </ProtectedRoute>
      } />
      <Route path="balance-sheet" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <BalanceSheetPage />
        </ProtectedRoute>
      } />
      <Route path="income-statement" element={
        <ProtectedRoute allowedRoles={["accountant", "managing_director", "general_manager"]}>
          <IncomeStatementPage />
        </ProtectedRoute>
      } />
    </Route>
  );
};

