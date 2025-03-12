
import { Route, Routes } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { FinanceRoutes } from "./FinanceRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { CustomerClientRoutes } from "./CustomerClientRoutes";
import { StockRoutes } from "./StockRoutes";
import { TreatmentRoutes } from "./TreatmentRoutes";
import { ReportRoutes } from "./ReportRoutes";
import NotFound from "@/pages/NotFound";
import { DashboardRedirect } from "@/components/navigation/DashboardRedirect";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<login />} />
      <Route path="/dashboards" element={<DashboardRedirect />} />
      <AuthRoutes />
      <FinanceRoutes />
      <DashboardRoutes />
      <CustomerClientRoutes />
      <StockRoutes />
      <TreatmentRoutes />
      <ReportRoutes />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

