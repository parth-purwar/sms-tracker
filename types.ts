
export interface Expense {
  id: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  originalSms?: string;
}

export interface DailyTotal {
  date: string;
  amount: number;
}

export type AppTab = 'dashboard' | 'expenses' | 'import';
