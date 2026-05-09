"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";
import { transactionService, TransactionResponse } from "@/lib/services";

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, "id" | "createdAt">>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  resetToMockData: () => void;
}

let idCounter = 1;
function generateId(): string {
  return `tx_${Date.now()}_${idCounter++}`;
}

// Convert backend transaction to frontend format
const convertTransaction = (tx: TransactionResponse): Transaction => ({
  id: tx.id.toString(),
  date: new Date(tx.date).toISOString().split('T')[0],
  amount: tx.amount,
  type: tx.type === "INCOME" ? "income" : "expense",
  category: tx.categoryName.toLowerCase() as any,
  description: tx.notes || "",
  createdAt: tx.createdAt,
  updatedAt: tx.createdAt
});

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: MOCK_TRANSACTIONS,
      isLoading: false,
      error: null,

      addTransaction: async (t) => {
        set({ isLoading: true, error: null });
        try {
          const response = await transactionService.create({
            categoryName: t.category,
            amount: t.amount,
            type: t.type === "income" ? "INCOME" : "EXPENSE",
            date: t.date,
            notes: t.description
          });
          
          const newTx = convertTransaction(response.data.data);
          
          set((state) => ({
            transactions: [newTx, ...state.transactions],
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.msg || "Failed to add transaction"
          });
        }
      },

      updateTransaction: async (id, patch) => {
        set({ isLoading: true, error: null });
        try {
          const numId = parseInt(id);
          const response = await transactionService.update(numId, {
            categoryName: patch.category,
            amount: patch.amount,
            type: patch.type === "income" ? "INCOME" : "EXPENSE",
            date: patch.date,
            notes: patch.description
          });
          
          const updatedTx = convertTransaction(response.data.data);
          
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? updatedTx : t
            ),
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.msg || "Failed to update transaction"
          });
        }
      },

      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const numId = parseInt(id);
          await transactionService.delete(numId);
          
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            isLoading: false,
            error: error.response?.data?.msg || "Failed to delete transaction"
          });
        }
      },

      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await transactionService.getById(0); // This needs adjustment based on actual API
          // For now, using mock data if API call fails
          set({ isLoading: false });
        } catch (error: any) {
          // Fallback to mock data if not authenticated
          set({ isLoading: false });
        }
      },

      resetToMockData: () => set({ transactions: MOCK_TRANSACTIONS })
    }),
    {
      name: "_transactions",
      onRehydrateStorage: () => (state) => {
        if (state && state.transactions.length === 0) {
          state.transactions = MOCK_TRANSACTIONS;
        }
      }
    }
  )
);
