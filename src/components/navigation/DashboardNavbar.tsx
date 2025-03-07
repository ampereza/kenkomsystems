
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
}

type NavbarProps = {
  title: string;
  items: NavItem[];
}

export function DashboardNavbar({ title, items }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">{title}</span>
            </div>
            
            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {items.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={cn(
                  "px-2.5 py-1.5 text-xs sm:text-sm rounded-md whitespace-nowrap transition-colors",
                  location.pathname === item.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-2 pt-2 border-t animate-fade-in">
              <div className="flex flex-col space-y-1">
                {items.map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className={cn(
                      "px-3 py-2 text-sm rounded-md transition-colors",
                      location.pathname === item.href 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
