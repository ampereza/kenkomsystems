
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
              KDL MANAGEMENT SYSTEM
            </Link>
            
            {/* Always show these main dashboard links on the index page */}
            <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Financial Dashboard
            </Link>
            <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Stock Dashboard
            </Link>
            <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Treatment Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
