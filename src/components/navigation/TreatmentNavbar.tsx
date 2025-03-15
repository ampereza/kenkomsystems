
import { DashboardNavbar } from "./DashboardNavbar";
import { 
  Clipboard, 
  Activity, 
  Users, 
  Package, 
  ClipboardList, 
  TestTube2,
  BarChart3,
  FileText
} from "lucide-react";

export function TreatmentNavbar() {
  const navItems = [
    { 
      href: "/dashboards/treatment", 
      label: "Dashboard", 
      icon: <Activity className="h-4 w-4" /> 
    },
    { 
      href: "/treatment/operations", 
      label: "Operations", 
      icon: <Clipboard className="h-4 w-4" /> 
    },
    { 
      href: "/treatment/log", 
      label: "Treatment Log", 
      icon: <ClipboardList className="h-4 w-4" /> 
    },
    { 
      href: "/treatment/report", 
      label: "Treatment Report", 
      icon: <BarChart3 className="h-4 w-4" /> 
    },
    { 
      href: "/clients", 
      label: "Clients", 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      href: "/clients/stock", 
      label: "Client Stock", 
      icon: <Package className="h-4 w-4" /> 
    },
  ];

  return <DashboardNavbar title="Treatment Management" items={navItems} />;
}
