
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link to="/" className="text-xl font-bold whitespace-nowrap">
              KDL MANAGEMENT SYSTEM
            </Link>
            
            <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Financial Dashboard
            </Link>
            <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Stock Dashboard
            </Link>
            <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              Treatment Dashboard
            </Link>
            <Link to="/admin/users" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
              User Management
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
