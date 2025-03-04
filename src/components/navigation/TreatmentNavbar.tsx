
import { DashboardNavbar } from "./DashboardNavbar";

export function TreatmentNavbar() {
  const navItems = [
    { href: "/dashboards/treatment", label: "Dashboard" },
    { href: "/treatment/operations", label: "Operations" },
    { href: "/treatment/log", label: "Treatment Log" },
    { href: "/treatments/clients", label: "Clients" },
    { href: "/treatments/stock", label: "Client Stock" },
  ];

  return <DashboardNavbar title="Treatment Management" items={navItems} />;
}
