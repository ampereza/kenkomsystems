
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const showFinanceLinks = profile?.role && ['general_manager', 'managing_director', 'accountant'].includes(profile.role);
  const showStockLinks = profile?.role && ['general_manager', 'managing_director', 'stock_manager'].includes(profile.role);
  const showAllReports = profile?.role && ['general_manager', 'managing_director'].includes(profile.role);
  const showFinanceReports = profile?.role === 'accountant';
  const showStockReports = profile?.role === 'stock_manager';

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold">
              Stock Management
            </Link>
            
            {showStockLinks && (
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
            )}

            {(showAllReports || showFinanceReports || showStockReports) && (
              <div className="border-l mx-2 h-6" />
            )}

            {(showAllReports || showFinanceReports) && (
              <>
                <Link to="/reports/ledger" className="text-sm hover:text-primary/80 transition-colors">
                  General Ledger
                </Link>
                <Link to="/reports/financial" className="text-sm hover:text-primary/80 transition-colors">
                  Financial Report
                </Link>
              </>
            )}
            
            {(showAllReports || showStockReports) && (
              <>
                <Link to="/reports/stock" className="text-sm hover:text-primary/80 transition-colors">
                  Stock Report
                </Link>
                <Link to="/reports/suppliers" className="text-sm hover:text-primary/80 transition-colors">
                  Supplier Report
                </Link>
              </>
            )}

            {showAllReports && (
              <Link to="/reports/employees" className="text-sm hover:text-primary/80 transition-colors">
                Employee Report
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm text-muted-foreground">
                {profile.full_name || profile.email} ({profile.role})
              </span>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
