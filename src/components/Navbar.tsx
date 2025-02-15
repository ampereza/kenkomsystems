
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Stock Management
          </Link>
          <div className="flex gap-4">
            <Link 
              to="/stock/receive" 
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Receive Stock
            </Link>
            <Link 
              to="/stock/sort" 
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Sort Stock
            </Link>
            <Link 
              to="/stock/receive-sorted" 
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Receive Sorted
            </Link>
            <Link 
              to="/stock/suppliers" 
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Suppliers
            </Link>
            <Link 
              to="/stock/rejected-poles" 
              className="text-sm hover:text-primary/80 transition-colors"
            >
              Rejected Poles
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
