
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link to="/" className="text-xl font-bold whitespace-nowrap">
              Stock Management
            </Link>
            
            {isIndexPage ? (
              // Simplified navigation for index page
              <>
                <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Financial Dashboard
                </Link>
                <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Stock Dashboard
                </Link>
                <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Treatment Dashboard
                </Link>
              </>
            ) : (
              // Full navigation for other pages
              <>
                {/* Dashboard Links */}
                <>
                  <Link to="/dashboards/md" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    MD Dashboard
                  </Link>
                  <Link to="/dashboards/general-manager" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    General Manager
                  </Link>
                  <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Financial
                  </Link>
                  <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Stock
                  </Link>
                  <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Treatment
                  </Link>
                  <Link to="/treatment/operations" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Treatment Ops
                  </Link>
                  <Link to="/treatment/log" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Treatment Log
                  </Link>
                </>

                <div className="border-l mx-2 h-6" />
                
                {/* Stock Management Links */}
                <>
                  <Link to="/stock/receive" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Receive Stock
                  </Link>
                  <Link to="/stock/sort" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Sort Stock
                  </Link>
                  <Link to="/stock/receive-sorted" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Receive Sorted
                  </Link>
                  <Link to="/stock/suppliers" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Suppliers
                  </Link>
                  <Link to="/stock/rejected-poles" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Rejected Poles
                  </Link>
                </>

                <div className="border-l mx-2 h-6" />

                {/* Finance Links */}
                <>
                  <Link to="/finance/transactions" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Transactions
                  </Link>
                  <Link to="/finance/expenses" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Expenses
                  </Link>
                  <Link to="/finance/employees" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Employees
                  </Link>
                </>

                <div className="border-l mx-2 h-6" />

                {/* Report Links */}
                <>
                  <Link to="/reports/ledger" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    General Ledger
                  </Link>
                  <Link to="/reports/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Financial Report
                  </Link>
                  <Link to="/reports/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Stock Report
                  </Link>
                  <Link to="/reports/suppliers" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Supplier Report
                  </Link>
                  <Link to="/reports/employees" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Employee Report
                  </Link>
                </>

                <div className="border-l mx-2 h-6" />

                {/* Treatment Links */}
                <>
                  <Link to="/treatments/clients" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Clients
                  </Link>
                  <Link to="/treatments/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    Client Stock
                  </Link>
                </>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
