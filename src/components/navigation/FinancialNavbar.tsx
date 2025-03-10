
import { DashboardNavbar } from "./DashboardNavbar";

export function FinancialNavbar() {
  const navItems = [
    { href: "/dashboards/financial", label: "Dashboard" },
    { href: "/finance/transactions", label: "Transactions" },
    { href: "/finance/receipts", label: "Receipts" },
    { href: "/finance/expenses", label: "Expenses" },
    { href: "/finance/payment-vouchers", label: "Payment Vouchers" },
    { href: "/finance/balance-sheet", label: "Balance Sheet" },
    { href: "/finance/income-statement", label: "Income Statement" },
    { href: "/reports/ledger", label: "General Ledger" },
    { href: "/reports/financial", label: "Financial Report" },
    { href: "/reports/employees", label: "Employee Report" },
  ];

  return <DashboardNavbar title="Financial Management" items={navItems} />;
}
