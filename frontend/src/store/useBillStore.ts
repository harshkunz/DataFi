"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Bill, BillFrequency } from "@/types";
import { billService } from "@/lib/services";

const MOCK_BILLS: Bill[] = [
  { id: "bill_1", name: "House Rent", amount: 12000, dueDate: "2026-04-01", category: "housing", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_2", name: "Electricity Bill", amount: 1800, dueDate: "2026-04-05", category: "utilities", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_3", name: "Internet", amount: 999, dueDate: "2026-04-10", category: "utilities", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_4", name: "Health Insurance", amount: 3500, dueDate: "2026-04-15", category: "health", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_5", name: "Netflix Subscription", amount: 649, dueDate: "2026-04-20", category: "entertainment", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_6", name: "Gym Membership", amount: 1200, dueDate: "2026-04-25", category: "health", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
  { id: "bill_7", name: "Car Insurance", amount: 8500, dueDate: "2026-06-01", category: "transport", isPaid: false, isRecurring: true, frequency: "yearly", createdAt: new Date().toISOString() },
  { id: "bill_8", name: "Water Bill", amount: 450, dueDate: "2026-03-28", category: "utilities", isPaid: false, isRecurring: true, frequency: "monthly", createdAt: new Date().toISOString() },
];

interface BillStore {
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
  
  addBill: (b: Omit<Bill, "id" | "createdAt">) => Promise<void>;
  updateBill: (id: string, patch: Partial<Omit<Bill, "id" | "createdAt">>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  fetchUpcomingBills: () => Promise<void>;
  fetchAllBills: () => Promise<void>;
}

export const useBillStore = create<BillStore>()(
  persist(
    (set) => ({
      bills: MOCK_BILLS,
      isLoading: false,
      error: null,

      addBill: async (b) => {
        set({ isLoading: true, error: null });
        try {
          const response = await billService.create({
            name: b.name,
            amount: b.amount,
            dueDate: b.dueDate,
            category: b.category,
            frequency: b.frequency as "weekly" | "monthly" | "yearly",
            notes: b.notes
          });

          const newBill: Bill = {
            id: response.data.data.id,
            name: response.data.data.name,
            amount: response.data.data.amount,
            dueDate: new Date(response.data.data.dueDate).toISOString().split('T')[0],
            category: response.data.data.category,
            isPaid: response.data.data.isPaid,
            isRecurring: response.data.data.isRecurring,
            frequency: response.data.data.frequency as BillFrequency,
            notes: response.data.data.notes,
            createdAt: response.data.data.createdAt
          };

          set((state) => ({
            bills: [newBill, ...state.bills],
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to add bill"
          });
        }
      },

      updateBill: async (id, patch) => {
        set({ isLoading: true, error: null });
        try {
          await billService.update(id, {
            name: patch.name,
            amount: patch.amount,
            dueDate: patch.dueDate,
            category: patch.category,
            frequency: patch.frequency as "weekly" | "monthly" | "yearly",
            notes: patch.notes
          });

          set((state) => ({
            bills: state.bills.map((b) => b.id === id ? { ...b, ...patch } : b),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to update bill"
          });
        }
      },

      deleteBill: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await billService.delete(id);
          set((state) => ({
            bills: state.bills.filter((b) => b.id !== id),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to delete bill"
          });
        }
      },

      markPaid: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await billService.markAsPaid(id);
          set((state) => ({
            bills: state.bills.map((b) => b.id === id ? { ...b, isPaid: true } : b),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to mark bill as paid"
          });
        }
      },

      fetchUpcomingBills: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await billService.getUpcoming();
          const bills = response.data.data.map((b: any): Bill => ({
            id: b.id,
            name: b.name,
            amount: b.amount,
            dueDate: new Date(b.dueDate).toISOString().split('T')[0],
            category: b.category,
            isPaid: b.isPaid,
            isRecurring: b.isRecurring,
            frequency: b.frequency as BillFrequency,
            notes: b.notes,
            createdAt: b.createdAt
          }));
          set({ bills, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to fetch bills"
          });
        }
      },

      fetchAllBills: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await billService.getAll();
          const bills = response.data.data.map((b: any): Bill => ({
            id: b.id,
            name: b.name,
            amount: b.amount,
            dueDate: new Date(b.dueDate).toISOString().split('T')[0],
            category: b.category,
            isPaid: b.isPaid,
            isRecurring: b.isRecurring,
            frequency: b.frequency as BillFrequency,
            notes: b.notes,
            createdAt: b.createdAt
          }));
          set({ bills, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to fetch bills"
          });
        }
      }
    }),
    {
      name: "_bills",
      onRehydrateStorage: () => (state) => {
        if (state && state.bills.length === 0) state.bills = MOCK_BILLS;
      }
    }
  )
);
