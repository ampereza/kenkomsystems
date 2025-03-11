
import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/navigation/DashboardSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1 md:ml-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
