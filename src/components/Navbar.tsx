
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Users, ChevronRight } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="border-b shadow-sm sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold whitespace-nowrap text-primary hover:opacity-90 transition-opacity">
              <LayoutDashboard className="h-5 w-5" />
              <span>KDL MANAGEMENT</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/dashboards/financial" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/dashboards/financial") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Financial
                </span>
                {isActive("/dashboards/financial") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>
              
              <Link 
                to="/dashboards/stock" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/dashboards/stock") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Stock
                </span>
                {isActive("/dashboards/stock") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>
              
              <Link 
                to="/dashboards/treatment" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/dashboards/treatment") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Treatment
                </span>
                {isActive("/dashboards/treatment") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>
              
              <Link 
                to="/admin/users" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/admin/users") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </span>
                {isActive("/admin/users") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help" className="text-muted-foreground hover:text-foreground">
                Help
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/profile">
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
