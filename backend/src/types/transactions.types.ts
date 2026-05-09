export type TransactionType = "INCOME" | "EXPENSE";

export interface CreateTransactionBody {
  userId: number;
  amount: number;
  type: TransactionType;
  categoryName: string;
  date: Date;
  notes?: string;
}

export interface CreateTransactionResponse {
  id: number;
  userId: number;
  amount: number;
  type: TransactionType;
  categoryName: string;
  date: Date;
  notes?: string | null;
}

export interface UpdateTransactionBody {
  amount?: number;
  type?: TransactionType;
  categoryName?: string;
  date?: Date;
  notes?: string | null;
}

export interface TransactionResponse {
  id: number;
  userId?: number;
  amount?: number;
  type?: TransactionType;
  categoryName?: string;
  date?: Date;
  notes?: string | null;
  msg?: string
}

export type ErrorResponse = {
  success: false;
  msg?: string;
  errors?: {
    field: string;
    message: string;
  }[];
};

export interface BalanceResponse {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
};

export type GroupedType = {
  type: TransactionType;
  _sum: { amount: number | null };
};

export interface TotalByType {
  type: TransactionType,
  amount: number
}

export interface TrandResponse {
  id: number;
  amount: number;
  type: TransactionType;
  categoryName?: string;
  date: Date;
}

export interface FilterQuery {
  type?: "INCOME" | "EXPENSE";
  amount?: number;
  categoryName?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  category?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationResponse {
  data: TransactionResponse[],
  meta: PaginationMeta
}