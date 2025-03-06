
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

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
  
  return (
    <nav className="border-b shadow-sm bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{title}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
        </div>
      </div>
    </nav>
  );
}
