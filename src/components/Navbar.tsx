
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";
  const { user, profile, signOut } = useAuth();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link to="/" className="text-xl font-bold whitespace-nowrap">
              KDL MANAGEMENT SYSTEM
            </Link>
            
            {/* Only show dashboard links when user is logged in */}
            {user && (
              <>
                {/* General Dashboard Links - accessible by all */}
                <Link to="/dashboards/financial" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Financial Dashboard
                </Link>
                <Link to="/dashboards/stock" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Stock Dashboard
                </Link>
                <Link to="/dashboards/treatment" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                  Treatment Dashboard
                </Link>
                
                {/* Admin links for managing director and general manager */}
                {profile?.role === 'managing_director' || profile?.role === 'general_manager' ? (
                  <Link to="/admin/users" className="text-sm hover:text-primary/80 transition-colors whitespace-nowrap">
                    User Management
                  </Link>
                ) : null}
              </>
            )}
          </div>
          
          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground hidden md:block">
                  <span>{profile?.full_name || user.email}</span>
                  {profile?.role && (
                    <span className="ml-2 text-xs px-2 py-1 bg-muted rounded-md">
                      {profile.role.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
