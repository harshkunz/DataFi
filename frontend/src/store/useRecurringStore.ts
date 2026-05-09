"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RecurringTransaction } from "@/types";
import { recurringService } from "@/lib/services";

const MOCK_RECURRING: RecurringTransaction[] = [
  { id: "rec_1", description: "Monthly Salary", amount: 85000, type: "income", category: "salary", frequency: "monthly", startDate: "2024-01-01", nextDueDate: "2026-04-30", isActive: true, createdAt: new Date().toISOString() },
  { id: "rec_2", description: "House Rent", amount: 12000, type: "expense", category: "housing", frequency: "monthly", startDate: "2024-01-01", nextDueDate: "2026-04-01", isActive: true, createdAt: new Date().toISOString() },
  { id: "rec_3", description: "Netflix", amount: 649, type: "expense", category: "entertainment", frequency: "monthly", startDate: "2024-03-01", nextDueDate: "2026-04-20", isActive: true, createdAt: new Date().toISOString() },
  { id: "rec_4", description: "Gym Membership", amount: 1200, type: "expense", category: "health", frequency: "monthly", startDate: "2024-01-01", nextDueDate: "2026-04-25", isActive: true, createdAt: new Date().toISOString() },
  { id: "rec_5", description: "Phone Bill", amount: 599, type: "expense", category: "utilities", frequency: "monthly", startDate: "2024-01-01", nextDueDate: "2026-04-15", isActive: false, createdAt: new Date().toISOString() },
];

interface RecurringStore {
  items: RecurringTransaction[];
  isLoading: boolean;
  error: string | null;
  
  addItem: (item: Omit<RecurringTransaction, "id" | "createdAt">) => Promise<void>;
  updateItem: (id: string, patch: Partial<Omit<RecurringTransaction, "id" | "createdAt">>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
}

// Convert backend recurring to frontend format
const convertRecurring = (r: any): RecurringTransaction => ({
  id: r.id,
  description: r.categoryName,
  amount: r.amount,
  type: r.type === "INCOME" ? "income" : "expense",
  category: r.categoryName.toLowerCase() as any,
  frequency: r.frequency.toLowerCase() as any,
  startDate: new Date(r.startDate).toISOString().split('T')[0],
  nextDueDate: new Date(r.nextDate).toISOString().split('T')[0],
  isActive: r.isActive,
  createdAt: r.createdAt
});

export const useRecurringStore = create<RecurringStore>()(
  persist(
    (set) => ({
      items: MOCK_RECURRING,
      isLoading: false,
      error: null,

      addItem: async (item) => {
        set({ isLoading: true, error: null });
        try {
          const response = await recurringService.create({
            categoryName: item.description,
            amount: item.amount,
            type: item.type === "income" ? "INCOME" : "EXPENSE",
            frequency: item.frequency.toUpperCase() as "WEEKLY" | "MONTHLY" | "YEARLY",
            startDate: item.startDate
          });

          const newItem = convertRecurring(response.data.data);
          set((state) => ({
            items: [newItem, ...state.items],
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to add recurring transaction"
          });
        }
      },

      updateItem: async (id, patch) => {
        set({ isLoading: true, error: null });
        try {
          await recurringService.update(id, {
            categoryName: patch.description,
            amount: patch.amount,
            type: patch.type === "income" ? "INCOME" : "EXPENSE",
            frequency: patch.frequency?.toUpperCase() as "WEEKLY" | "MONTHLY" | "YEARLY",
            startDate: patch.startDate
          });

          set((state) => ({
            items: state.items.map((r) => r.id === id ? { ...r, ...patch } : r),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to update recurring transaction"
          });
        }
      },

      deleteItem: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await recurringService.delete(id);
          set((state) => ({
            items: state.items.filter((r) => r.id !== id),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to delete recurring transaction"
          });
        }
      },

      toggleActive: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const item = (set as any).getState().items.find((r: RecurringTransaction) => r.id === id);
          if (!item) throw new Error("Item not found");

          await recurringService.update(id, {
            categoryName: item.description,
            amount: item.amount,
            type: item.type === "income" ? "INCOME" : "EXPENSE",
            frequency: item.frequency.toUpperCase() as "WEEKLY" | "MONTHLY" | "YEARLY",
            startDate: item.startDate
          });

          set((state) => ({
            items: state.items.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to toggle recurring transaction"
          });
        }
      },

      fetchItems: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await recurringService.getAll();
          const items = response.data.data.map(convertRecurring);
          set({ items, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to fetch recurring transactions"
          });
        }
      }
    }),
    {
      name: "_recurring",
      onRehydrateStorage: () => (state) => {
        if (state && state.items.length === 0) state.items = MOCK_RECURRING;
      }
    }
  )
);
