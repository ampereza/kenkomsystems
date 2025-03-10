
import { DashboardNavbar } from "./DashboardNavbar";
import { 
  Package, 
  ArrowDownToLine, 
  ArrowUpToLine, 
  PackageCheck, 
  Store, 
  BarChart3 
} from "lucide-react";

export function StockNavbar() {
  const navItems = [
    { 
      href: "/dashboards/stock", 
      label: "Dashboard", 
      icon: <BarChart3 className="h-4 w-4" /> 
    },
    { 
      href: "/stock/receive", 
      label: "Receive Stock", 
      icon: <ArrowDownToLine className="h-4 w-4" /> 
    },
    { 
      href: "/stock/sort", 
      label: "Sort Stock", 
      icon: <ArrowUpToLine className="h-4 w-4" /> 
    },
    { 
      href: "/stock/receive-sorted", 
      label: "Receive Sorted", 
      icon: <PackageCheck className="h-4 w-4" /> 
    },
    { 
      href: "/stock/report", 
      label: "Stock Report", 
      icon: <BarChart3 className="h-4 w-4" /> 
    },
  ];

  return <DashboardNavbar title="Stock Management" items={navItems} />;
}
