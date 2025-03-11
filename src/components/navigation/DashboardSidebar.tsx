
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  ChevronRight, 
  Menu, 
  X, 
  Activity,
  CircleDollarSign,
  FileBarChart,
  TestTube2,
  ClipboardList 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarLink = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

type SidebarGroup = {
  title: string;
  links: SidebarLink[];
};

export function DashboardSidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarGroups: SidebarGroup[] = [
    {
      title: "Dashboards",
      links: [
        {
          icon: <LayoutDashboard className="h-5 w-5" />,
          label: "Financial",
          href: "/dashboards/financial"
        },
        {
          icon: <Package className="h-5 w-5" />,
          label: "Stock",
          href: "/dashboards/stock"
        },
        {
          icon: <TestTube2 className="h-5 w-5" />,
          label: "Treatment",
          href: "/dashboards/treatment"
        }
      ]
    },
    {
      title: "Reports",
      links: [
        {
          icon: <CircleDollarSign className="h-5 w-5" />,
          label: "Financial Report",
          href: "/reports/financial"
        },
        {
          icon: <FileBarChart className="h-5 w-5" />,
          label: "Stock Report",
          href: "/reports/stock"
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Employee Report",
          href: "/reports/employees"
        },
      ]
    },
    {
      title: "Management",
      links: [
        {
          icon: <FileText className="h-5 w-5" />,
          label: "Transactions",
          href: "/finance/transactions"
        },
        {
          icon: <ClipboardList className="h-5 w-5" />,
          label: "Treatment Log",
          href: "/treatment/log"
        },
        {
          icon: <Activity className="h-5 w-5" />,
          label: "Stock Management",
          href: "/stock/sort"
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Users",
          href: "/admin/users"
        }
      ]
    }
  ];

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMenu}
          className="bg-background/90 backdrop-blur-sm"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - desktop always visible, mobile as overlay */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-background border-r shadow-sm z-40 flex flex-col transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="text-primary">KDL MANAGEMENT</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4 px-3">
          {sidebarGroups.map((group, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t mt-auto">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link 
            to="/help" 
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Help
          </Link>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
