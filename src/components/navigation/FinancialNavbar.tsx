
import { DashboardNavbar } from "./DashboardNavbar";
import { 
  LayoutDashboard, 
  Receipt, 
  DollarSign, 
  Users, 
  FileText, 
  BarChart3, 
  Wallet,
  ScrollText,
  BarChart
} from "lucide-react";

export function FinancialNavbar() {
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
      icon: <Wallet className="h-4 w-4" />
    },
    { 
      href: "/finance/payment-vouchers", 
      label: "Payment Vouchers",
      icon: <FileText className="h-4 w-4" />
    },
    { 
      href: "/finance/balance-sheet", 
      label: "Balance Sheet",
      icon: <ScrollText className="h-4 w-4" />
    },
    { 
      href: "/finance/income-statement", 
      label: "Income Statement",
      icon: <BarChart className="h-4 w-4" />
    },
    { 
      href: "/finance/generalledger", 
      label: "General Ledger",
      icon: <FileText className="h-4 w-4" />
    },
    { 
      href: "/finance/financialreport", 
      label: "Financial Report",
      icon: <BarChart3 className="h-4 w-4" />
    },
    { 
      href: "/reports/employeereport", 
      label: "Employee Report",
      icon: <Users className="h-4 w-4" />
    },
  ];

  return <DashboardNavbar title="Financial Management" items={navItems} />;
}
