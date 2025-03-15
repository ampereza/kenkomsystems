
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Menu, 
  X, 
  Activity,
  CircleDollarSign,
  FileBarChart,
  TestTube2,
  ClipboardList,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
          icon: <FileBarChart className="h-5 w-5" />,
          label: "Supplier Report",
          href: "/suppliers/supplier-report"
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
          label: "Customers",
          href: "/customers/list"
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Clients",
          href: "/clients"
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Suppliers",
          href: "/suppliers/view-suppliers"
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
          {profile && (
            <div className="flex items-center gap-3 mb-3 p-2">
              <Avatar>
                <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{profile.full_name || profile.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{profile.role}</span>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
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
