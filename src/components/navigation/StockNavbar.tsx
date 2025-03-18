
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./DashboardSidebar";
import { Package, ListFilter, FileBarChart, Truck, AlertTriangle } from "lucide-react";

export function StockNavbar() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/dashboards/stock",
      label: "Dashboard",
      icon: <Package className="h-4 w-4" />
    },
    {
      href: "/stock/sort",
      label: "Sort Stock",
      icon: <ListFilter className="h-4 w-4" />
    },
    {
      href: "/stock/report",
      label: "Stock Report",
      icon: <FileBarChart className="h-4 w-4" />
    },
    {
      href: "/suppliers/view-suppliers",
      label: "Suppliers",
      icon: <Truck className="h-4 w-4" />
    },
    {
      href: "/suppliers/rejected-poles",
      label: "Rejected Poles",
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  return (
    <>
      <DashboardSidebar />
      <div className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4 md:ml-64">
          <div className="flex items-center space-x-4 md:ml-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="hidden md:inline-block">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
