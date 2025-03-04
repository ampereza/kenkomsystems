
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link to="/" className="text-xl font-bold whitespace-nowrap">
              {title}
            </Link>
            
            {items.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={cn(
                  "text-sm hover:text-primary/80 transition-colors whitespace-nowrap",
                  location.pathname === item.href && "font-medium text-primary"
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
