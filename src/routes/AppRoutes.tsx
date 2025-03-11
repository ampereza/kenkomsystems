
import { Routes } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { FinanceRoutes } from "./FinanceRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { CustomerClientRoutes } from "./CustomerClientRoutes";
import { StockRoutes } from "./StockRoutes";
import { TreatmentRoutes } from "./TreatmentRoutes";
import { ReportRoutes } from "./ReportRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      <AuthRoutes />
      <FinanceRoutes />
      <DashboardRoutes />
      <CustomerClientRoutes />
      <StockRoutes />
      <TreatmentRoutes />
      <ReportRoutes />
    </Routes>
  );
};

