
import { DashboardNavbar } from "./DashboardNavbar";

export function FinancialNavbar() {
  const navItems = [
    { href: "/dashboards/financial", label: "Dashboard" },
    { href: "/finance/transactions", label: "Transactions" },
    { href: "/finance/expenses", label: "Expenses" },
    { href: "/finance/employees", label: "Employees" },
    { href: "/reports/ledger", label: "General Ledger" },
    { href: "/reports/financial", label: "Financial Report" },
    { href: "/reports/employees", label: "Employee Report" },
  ];

  return <DashboardNavbar title="Financial Management" items={navItems} />;
}
