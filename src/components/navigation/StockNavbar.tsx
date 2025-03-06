
import { DashboardNavbar } from "./DashboardNavbar";
import { Package, ArrowDownToLine, ArrowUpToLine, PackageCheck, Truck, BarChart3, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function StockNavbar() {
  const location = useLocation();
  const navItems = [
    { href: "/dashboards/stock", label: "Dashboard" },
    { href: "/stock/receive", label: "Receive Stock" },
    { href: "/stock/sort", label: "Sort Stock" },
    { href: "/stock/receive-sorted", label: "Receive Sorted" },
    { href: "/stock/suppliers", label: "Suppliers" },
    { href: "/reports/stock", label: "Stock Report" },
    { href: "/reports/suppliers", label: "Supplier Report" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/40 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your inventory, sort and receive stock, track suppliers
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.href.includes("dashboard") && <BarChart3 className="h-4 w-4" />}
              {item.href.includes("receive-sorted") && <PackageCheck className="h-4 w-4" />}
              {item.href.includes("receive") && !item.href.includes("sorted") && <ArrowDownToLine className="h-4 w-4" />}
              {item.href.includes("sort") && <ArrowUpToLine className="h-4 w-4" />}
              {item.href.includes("suppliers") && <Store className="h-4 w-4" />}
              {item.href.includes("report") && <BarChart3 className="h-4 w-4" />}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
