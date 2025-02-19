
import { BaseIncomeStatement, AccountIncomeStatement, DetailedIncomeStatement } from "./types";

export const calculateNetIncome = (data: (BaseIncomeStatement | AccountIncomeStatement | DetailedIncomeStatement)[]) => {
  return data?.reduce((acc, curr) => {
    const amount = 'total_amount' in curr ? curr.total_amount : ('amount' in curr ? curr.amount : 0);
    if (curr.account_type === 'revenue') {
      return acc + Number(amount || 0);
    } else if (curr.account_type === 'expense') {
      return acc - Number(amount || 0);
    }
    return acc;
  }, 0) || 0;
};
