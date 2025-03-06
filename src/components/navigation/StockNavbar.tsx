
import { DashboardNavbar } from "./DashboardNavbar";

export function StockNavbar() {
  const navItems = [
    { href: "/dashboards/stock", label: "Dashboard" },
    { href: "/stock/receive", label: "Receive Stock" },
    { href: "/stock/sort", label: "Sort Stock" },
    { href: "/stock/receive-sorted", label: "Receive Sorted" },
    { href: "/stock/suppliers", label: "Suppliers" },
    { href: "/reports/stock", label: "Stock Report" },
    { href: "/reports/suppliers", label: "Supplier Report" },
  ];

  return <DashboardNavbar title="Stock Management" items={navItems} />;
}
