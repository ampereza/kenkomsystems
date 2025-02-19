
import { Link } from "react-router-dom";

export function Navbar() {
  // Show all links for development
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold">
              Stock Management
            </Link>
            
            {/* Dashboard Links */}
            <>
              <Link to="/dashboards/md" className="text-sm hover:text-primary/80 transition-colors">
                MD Dashboard
              </Link>
              <Link to="/dashboards/general-manager" className="text-sm hover:text-primary/80 transition-colors">
                General Manager
              </Link>
              <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors">
                Financial
              </Link>
              <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors">
                Stock
              </Link>
              <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors">
                Treatment
              </Link>
            </>

            <div className="border-l mx-2 h-6" />
            
            {/* Stock Management Links */}
            <>
              <Link to="/stock/receive" className="text-sm hover:text-primary/80 transition-colors">
                Receive Stock
              </Link>
              <Link to="/stock/sort" className="text-sm hover:text-primary/80 transition-colors">
                Sort Stock
              </Link>
              <Link to="/stock/receive-sorted" className="text-sm hover:text-primary/80 transition-colors">
                Receive Sorted
              </Link>
              <Link to="/stock/suppliers" className="text-sm hover:text-primary/80 transition-colors">
                Suppliers
              </Link>
              <Link to="/stock/rejected-poles" className="text-sm hover:text-primary/80 transition-colors">
                Rejected Poles
              </Link>
            </>

            <div className="border-l mx-2 h-6" />

            {/* Report Links */}
            <>
              <Link to="/reports/ledger" className="text-sm hover:text-primary/80 transition-colors">
                General Ledger
              </Link>
              <Link to="/reports/financial" className="text-sm hover:text-primary/80 transition-colors">
                Financial Report
              </Link>
              <Link to="/reports/stock" className="text-sm hover:text-primary/80 transition-colors">
                Stock Report
              </Link>
              <Link to="/reports/suppliers" className="text-sm hover:text-primary/80 transition-colors">
                Supplier Report
              </Link>
              <Link to="/reports/employees" className="text-sm hover:text-primary/80 transition-colors">
                Employee Report
              </Link>
            </>
          </div>
        </div>
      </div>
    </nav>
  );
}
