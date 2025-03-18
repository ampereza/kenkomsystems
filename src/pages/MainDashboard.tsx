
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, FileText, Package, CircleDollarSign, 
  FileBarChart, ClipboardList 
} from "lucide-react";

const MainDashboard: React.FC = () => {
  // Define categories for better organization
  const categories = [
    {
      title: "Dashboards",
      icon: <FileBarChart className="h-5 w-5 text-primary" />,
      items: [
        { name: "Financial Dashboard", path: "/dashboards/financial" },
        { name: "General Manager Dashboard", path: "/dashboards/gm" },
        { name: "Managing Director Dashboard", path: "/dashboards/md" },
        { name: "Stock Dashboard", path: "/dashboards/stock" },
        { name: "Treatment Dashboard", path: "/dashboards/treatment" },
      ]
    },
    {
      title: "Finance",
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
      items: [
        { name: "Transactions", path: "/finance/transactions" },
        { name: "Receipts", path: "/finance/receipts" },
        { name: "Expenses", path: "/finance/expenses" },
        { name: "Employees", path: "/finance/employees" },
        { name: "Payment Vouchers", path: "/finance/payment-vouchers" },
        { name: "Balance Sheet", path: "/finance/balance-sheet" },
        { name: "Income Statement", path: "/finance/income-statement" },
      ]
    },
    {
      title: "Customers & Clients",
      icon: <Users className="h-5 w-5 text-primary" />,
      items: [
        { name: "Customers", path: "/customers/list" },
        { name: "Add Customer", path: "/customers/add" },
        { name: "Clients", path: "/clients" },
        { name: "Client Stock", path: "/clients/stock" },
        { name: "Add Client Stock", path: "/clients/stock/add" },
      ]
    },
    {
      title: "Stock & Suppliers",
      icon: <Package className="h-5 w-5 text-primary" />,
      items: [
        { name: "Receive Stock", path: "/stock/receive" },
        { name: "Sort Stock", path: "/stock/sort" },
        { name: "Stock Report", path: "/stock/report" },
        { name: "Suppliers", path: "/suppliers/view-suppliers" },
        { name: "Add Supplier", path: "/suppliers/add" },
        { name: "Supplier Report", path: "/suppliers/supplier-report" },
        { name: "Rejected Poles", path: "/suppliers/rejected-poles" },
      ]
    },
    {
      title: "Treatment & Reports",
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
      items: [
        { name: "Treatment Log", path: "/treatment/log" },
        { name: "Treatment Report", path: "/treatment/report" },
        { name: "Employee Report", path: "/reports/employees" },
        { name: "General Ledger", path: "/reports/general-ledger" },
        { name: "Financial Report", path: "/reports/financial" },
      ]
    },
    {
      title: "Administration",
      icon: <FileText className="h-5 w-5 text-primary" />,
      items: [
        { name: "Add User", path: "/admin/add-user" },
        { name: "Remove User", path: "/admin/remove-user" }
      ]
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Main Dashboard</h1>
      <p className="mb-6">Welcome! Choose a section to navigate:</p>
      
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center mb-4">
              {category.icon}
              <h2 className="text-xl font-semibold ml-2">{category.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className="p-4 border rounded-xl shadow-sm hover:bg-gray-100 transition flex items-center"
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
