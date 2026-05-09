"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal } from "@/types";
import { goalService } from "@/lib/services";

const MOCK_GOALS: Goal[] = [
  { id: "goal_1", name: "Emergency Fund", targetAmount: 150000, savedAmount: 62000, deadline: "2026-12-31", category: "other", color: "#6366f1", createdAt: new Date().toISOString() },
  { id: "goal_2", name: "Europe Vacation", targetAmount: 80000, savedAmount: 22000, deadline: "2026-09-01", category: "entertainment", color: "#f59e0b", createdAt: new Date().toISOString() },
  { id: "goal_3", name: "New Laptop", targetAmount: 90000, savedAmount: 45000, deadline: "2026-06-30", category: "shopping", color: "#10b981", createdAt: new Date().toISOString() },
  { id: "goal_4", name: "Home Down Payment", targetAmount: 500000, savedAmount: 120000, deadline: "2027-06-01", category: "housing", color: "#ef4444", createdAt: new Date().toISOString() },
];

const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
let colorIndex = 0;

interface GoalStore {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  
  addGoal: (g: Omit<Goal, "id" | "createdAt" | "color">) => Promise<void>;
  updateGoal: (id: string, patch: Partial<Omit<Goal, "id" | "createdAt">>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addSavings: (id: string, amount: number) => Promise<void>;
  fetchGoals: () => Promise<void>;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set) => ({
      goals: MOCK_GOALS,
      isLoading: false,
      error: null,

      addGoal: async (g) => {
        set({ isLoading: true, error: null });
        try {
          const response = await goalService.create({
            name: g.name,
            targetAmount: g.targetAmount,
            deadline: g.deadline,
            category: g.category
          });

          const newGoal: Goal = {
            id: response.data.data.id,
            name: response.data.data.name,
            targetAmount: response.data.data.targetAmount,
            savedAmount: response.data.data.currentAmount,
            deadline: new Date(response.data.data.deadline).toISOString().split('T')[0],
            category: response.data.data.category as any,
            color: colors[colorIndex++ % colors.length],
            createdAt: response.data.data.createdAt
          };

          set((state) => ({
            goals: [newGoal, ...state.goals],
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to add goal"
          });
        }
      },

      updateGoal: async (id, patch) => {
        set({ isLoading: true, error: null });
        try {
          await goalService.update(id, {
            name: patch.name,
            targetAmount: patch.targetAmount,
            deadline: patch.deadline,
            category: patch.category
          });

          set((state) => ({
            goals: state.goals.map((g) => g.id === id ? { ...g, ...patch } : g),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to update goal"
          });
        }
      },

      deleteGoal: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await goalService.delete(id);
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to delete goal"
          });
        }
      },

      addSavings: async (id, amount) => {
        set({ isLoading: true, error: null });
        try {
          await goalService.addContribution(id, amount);
          set((state) => ({
            goals: state.goals.map((g) =>
              g.id === id ? { ...g, savedAmount: Math.min(g.savedAmount + amount, g.targetAmount) } : g
            ),
            isLoading: false
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to add savings"
          });
        }
      },

      fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await goalService.getAll();
          const goals = response.data.data.map((g: any): Goal => ({
            id: g.id,
            name: g.name,
            targetAmount: g.targetAmount,
            savedAmount: g.currentAmount,
            deadline: new Date(g.deadline).toISOString().split('T')[0],
            category: g.category as any,
            color: colors[Math.floor(Math.random() * colors.length)],
            createdAt: g.createdAt
          }));
          set({ goals, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.msg || "Failed to fetch goals"
          });
        }
      }
    }),
    {
      name: "_goals",
      onRehydrateStorage: () => (state) => {
        if (state && state.goals.length === 0) state.goals = MOCK_GOALS;
      }
    }
  )
);
