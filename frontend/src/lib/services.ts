import apiClient from "./api";
import { Transaction, Bill } from "@/types";

// ────────────────── AUTH ──────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    role: string;
  };
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<{ success: boolean; data: LoginResponse }>("/auth/login", payload),

  refresh: (refreshToken: string) =>
    apiClient.post<{ success: boolean; data: { accessToken: string } }>(
      "/auth/refresh",
      { refreshToken }
    ),

  logout: () =>
    apiClient.post<{ success: boolean; data: { msg: string } }>("/auth/logout"),
};

// ────────────────── DASHBOARD ──────────────────

export interface BalanceResponse {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface TotalByType {
  type: "INCOME" | "EXPENSE";
  amount: number;
}

export interface TransactionResponse {
  id: number;
  userId: number;
  categoryName: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  notes?: string;
  createdAt: string;
}

export const dashboardService = {
  getBalance: () =>
    apiClient.get<{ success: boolean; data: BalanceResponse }>("/dashboard/balance"),

  getTransactionsByType: () =>
    apiClient.get<{ success: boolean; data: TotalByType[] }>("/dashboard/type"),

  getRecentTransactions: () =>
    apiClient.get<{ success: boolean; data: TransactionResponse[] }>(
      "/dashboard/recent"
    ),

  getTransactionTrends: (type: "WEEKLY" | "MONTHLY") =>
    apiClient.get<{ success: boolean; data: Record<string, number> }>(
      `/dashboard/trends?type=${type}`
    ),

  getFilteredTransactions: (filters: any, page: number = 1, limit: number = 10) =>
    apiClient.get<{ success: boolean; data: { transactions: TransactionResponse[]; total: number } }>(
      "/dashboard/filtered",
      { params: { ...filters, page, limit } }
    ),

  getTransactions: (page: number = 1, limit: number = 10) =>
    apiClient.get<{ success: boolean; data: { transactions: TransactionResponse[]; total: number } }>(
      "/dashboard/transactions",
      { params: { page, limit } }
    ),
};

// ────────────────── TRANSACTIONS ──────────────────

export interface CreateTransactionPayload {
  categoryName: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  notes?: string;
}

export const transactionService = {
  create: (payload: CreateTransactionPayload) =>
    apiClient.post<{ success: boolean; data: TransactionResponse }>(
      "/admin/transactions",
      payload
    ),

  update: (id: number, payload: Partial<CreateTransactionPayload>) =>
    apiClient.put<{ success: boolean; data: TransactionResponse }>(
      `/admin/transactions/${id}`,
      payload
    ),

  delete: (id: number) =>
    apiClient.delete<{ success: boolean; data: { msg: string } }>(
      `/admin/transactions/${id}`
    ),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: TransactionResponse }>(
      `/admin/transactions/${id}`
    ),
};

// ────────────────── BILLS ──────────────────

export interface CreateBillPayload {
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  frequency?: "weekly" | "monthly" | "yearly";
  notes?: string;
}

export const billService = {
  create: (payload: CreateBillPayload) =>
    apiClient.post<{ success: boolean; data: Bill }>(
      "/admin/bills",
      payload
    ),

  update: (id: string, payload: Partial<CreateBillPayload>) =>
    apiClient.put<{ success: boolean; data: Bill }>(
      `/admin/bills/${id}`,
      payload
    ),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean; data: { msg: string } }>(
      `/admin/bills/${id}`
    ),

  getUpcoming: () =>
    apiClient.get<{ success: boolean; data: Bill[] }>(
      "/admin/bills/upcoming"
    ),

  getAll: () =>
    apiClient.get<{ success: boolean; data: Bill[] }>(
      "/admin/bills"
    ),

  markAsPaid: (id: string) =>
    apiClient.patch<{ success: boolean; data: Bill }>(
      `/admin/bills/${id}/paid`
    ),
};

// ────────────────── GOALS ──────────────────

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  createdAt: string;
}

export interface CreateGoalPayload {
  name: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

export const goalService = {
  create: (payload: CreateGoalPayload) =>
    apiClient.post<{ success: boolean; data: Goal }>(
      "/admin/goals",
      payload
    ),

  update: (id: string, payload: Partial<CreateGoalPayload>) =>
    apiClient.put<{ success: boolean; data: Goal }>(
      `/admin/goals/${id}`,
      payload
    ),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean; data: { msg: string } }>(
      `/admin/goals/${id}`
    ),

  getAll: () =>
    apiClient.get<{ success: boolean; data: Goal[] }>(
      "/admin/goals"
    ),

  addContribution: (id: string, amount: number) =>
    apiClient.patch<{ success: boolean; data: Goal }>(
      `/admin/goals/${id}/contribute`,
      { amount }
    ),
};

// ────────────────── RECURRING ──────────────────

export interface RecurringTransaction {
  id: string;
  categoryName: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  frequency: "weekly" | "monthly" | "yearly";
  nextDate: string;
  notes?: string;
  createdAt: string;
}

export interface CreateRecurringPayload {
  categoryName: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  frequency: "weekly" | "monthly" | "yearly";
  startDate: string;
  notes?: string;
}

export const recurringService = {
  create: (payload: CreateRecurringPayload) =>
    apiClient.post<{ success: boolean; data: RecurringTransaction }>(
      "/admin/recurring",
      payload
    ),

  update: (id: string, payload: Partial<CreateRecurringPayload>) =>
    apiClient.put<{ success: boolean; data: RecurringTransaction }>(
      `/admin/recurring/${id}`,
      payload
    ),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean; data: { msg: string } }>(
      `/admin/recurring/${id}`
    ),

  getAll: () =>
    apiClient.get<{ success: boolean; data: RecurringTransaction[] }>(
      "/admin/recurring"
    ),
};

// ────────────────── USERS (Admin only) ──────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST" | "VIEWER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "ANALYST" | "VIEWER";
}

export const userService = {
  create: (payload: CreateUserPayload) =>
    apiClient.post<{ success: boolean; data: User }>(
      "/admin/users",
      payload
    ),

  update: (id: number, payload: Partial<Omit<CreateUserPayload, "password">>) =>
    apiClient.put<{ success: boolean; data: User }>(
      `/admin/users/${id}`,
      payload
    ),

  delete: (id: number) =>
    apiClient.delete<{ success: boolean; data: { msg: string } }>(
      `/admin/users/${id}`
    ),

  getAll: () =>
    apiClient.get<{ success: boolean; data: User[] }>(
      "/admin/users"
    ),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: User }>(
      `/admin/users/${id}`
    ),

  changePassword: (id: number, oldPassword: string, newPassword: string) =>
    apiClient.post<{ success: boolean; data: { msg: string } }>(
      `/admin/users/${id}/change-password`,
      { oldPassword, newPassword }
    ),
};

export default {
  auth: authService,
  dashboard: dashboardService,
  transaction: transactionService,
  bill: billService,
  goal: goalService,
  recurring: recurringService,
  user: userService,
};
