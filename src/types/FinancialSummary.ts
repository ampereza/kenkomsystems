
export type TransactionType = "purchase" | "sale" | "expense" | "salary" | "treatment_income" | "office_expense" | "wages" | "maintenance";

export interface TransactionSummary {
  date: string;
  total_amount: number;
  transaction_count: number;
  type: TransactionType;
}

export interface FinancialOverview {
  total_revenue: number;
  total_expenses: number;
  profit: number;
  customer_count: number;
}

export type FinancialSummary = TransactionSummary | FinancialOverview;

export function isFinancialOverview(data: FinancialSummary): data is FinancialOverview {
  return 'total_revenue' in data;
}

export function isTransactionSummary(data: FinancialSummary): data is TransactionSummary {
  return 'type' in data;
}
