
export interface BaseIncomeStatement {
  account_type: string;
  total_amount: number;
}

export interface DetailedIncomeStatement {
  account_code: string;
  account_name: string;
  account_type: string;
  entry_date: string;
  reference_number: string;
  description: string;
  amount: number;
}

export interface AccountIncomeStatement {
  account_code: string;
  account_name: string;
  account_type: string;
  total_amount: number;
}
