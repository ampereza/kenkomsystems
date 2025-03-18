
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./DashboardSidebar";
import { LayoutDashboard, Receipt, DollarSign, Users, FileText } from "lucide-react";

export function FinancialNavbar() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/dashboards/financial",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      href: "/finance/transactions",
      label: "Transactions",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      href: "/finance/receipts",
      label: "Receipts",
      icon: <Receipt className="h-4 w-4" />
    },
    {
      href: "/finance/expenses",
      label: "Expenses",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      href: "/finance/employees",
      label: "Employees",
      icon: <Users className="h-4 w-4" />
    },
    {
      href: "/finance/income-statement",
      label: "Income Statement",
      icon: <FileText className="h-4 w-4" />
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
