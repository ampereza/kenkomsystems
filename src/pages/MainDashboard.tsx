
import React from "react";
import { Link } from "react-router-dom";

const MainDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Main Dashboard</h1>
      <p className="mb-6">Welcome! Choose a section to navigate:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { name: "Financial Dashboard", path: "/dashboards/financial" },
          { name: "General Manager Dashboard", path: "/dashboards/general-manager" },
          { name: "Managing Director Dashboard", path: "/dashboards/md" },
          { name: "Stock Dashboard", path: "/dashboards/stock" },
          { name: "Treatment Dashboard", path: "/dashboards/treatment" },
          { name: "Transactions", path: "/finance/transactions" },
          { name: "Receipts", path: "/finance/receipts" },
          { name: "Expenses", path: "/finance/expense-authorizations" },
          { name: "Employees", path: "/finance/employees" },
          { name: "Payment Vouchers", path: "/finance/payment-vouchers" },
          { name: "Balance Sheet", path: "/finance/balance-sheet" },
          { name: "Income Statement", path: "/finance/income-statement" },
          { name: "Customers", path: "/customers/list" },
          { name: "Add Customer", path: "/customers/add" },
          { name: "Clients", path: "/clients" },
          { name: "Add Client", path: "/clients/add" },
          { name: "Client Stock", path: "/clients/stock" },
          { name: "Receive Stock", path: "/stock/receive" },
          { name: "Sort Stock", path: "/stock/sort" },
          { name: "Stock Report", path: "/stock/report" },
          { name: "Suppliers", path: "/suppliers/view-suppliers" },
          { name: "Add Supplier", path: "/suppliers/add" },
          { name: "Supplier Report", path: "/suppliers/supplier-report" },
          { name: "Rejected Poles", path: "/suppliers/rejected-poles" },
          { name: "Treatment Log", path: "/treatment/log" },
          { name: "Treatment Report", path: "/treatment/report" },
          { name: "Employee Report", path: "/reports/employee-report" },
          { name: "General Ledger", path: "/reports/general-ledger" },
          { name: "Financial Report", path: "/reports/financial-report" },
          { name: "Add User", path: "/admin/add-user" },
          { name: "Remove User", path: "/admin/remove-user" }
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="p-4 border rounded-xl shadow-sm hover:bg-gray-100 transition"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
