
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Users, ChevronRight, Menu, X, Building2, Store, Package } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="border-b shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold whitespace-nowrap text-primary hover:opacity-90 transition-opacity">
              <LayoutDashboard className="h-5 w-5" />
              <span>KDL MANAGEMENT</span>
            </Link>
            
            {/* Desktop Navigation */}
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
                  <Package className="h-4 w-4" />
                  Stock
                </span>
                {isActive("/dashboards/stock") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>

              <Link 
                to="/clients" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/clients") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Clients
                </span>
                {isActive("/clients") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>

              <Link 
                to="/customers/list" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/customers/list") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Customers
                </span>
                {isActive("/customers/list") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </Link>

              <Link 
                to="/suppliers/view-suppliers" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive("/suppliers/view-suppliers") 
                    ? "text-primary bg-primary/5" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Suppliers
                </span>
                {isActive("/suppliers/view-suppliers") && (
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
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
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
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 py-2 bg-background border-t rounded-b-lg animate-fade-in">
            <div className="flex flex-col space-y-1 px-2">
              <Link 
                to="/dashboards/financial" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/dashboards/financial") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Financial
                </span>
              </Link>
              
              <Link 
                to="/dashboards/stock" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/dashboards/stock") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Stock
                </span>
              </Link>

              <Link 
                to="/clients" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/clients") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Clients
                </span>
              </Link>

              <Link 
                to="/customers/list" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/customers/list") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Customers
                </span>
              </Link>

              <Link 
                to="/suppliers/view-suppliers" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/suppliers/view-suppliers") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Suppliers
                </span>
              </Link>
              
              <Link 
                to="/dashboards/treatment" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/dashboards/treatment") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Treatment
                </span>
              </Link>
              
              <Link 
                to="/admin/users" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/admin/users") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </span>
              </Link>
              
              <div className="border-t my-2 pt-2 flex flex-col space-y-1">
                <Link 
                  to="/help"
                  className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help
                </Link>
                <Link 
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-muted/50 hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
