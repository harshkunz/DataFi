import { db } from "../config/db";

export const createGoalService = async (userId: number, data: any) => {
  const goal = await db.goal.create({
    data: {
      ...data,
      userId,
      deadline: new Date(data.deadline)
    }
  });
  return goal;
};

export const updateGoalService = async (id: string, data: any) => {
  const goal = await db.goal.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined
    }
  });
  return goal;
};

export const deleteGoalService = async (id: string) => {
  await db.goal.delete({
    where: { id }
  });
};

export const getAllGoalsService = async (userId: number) => {
  const goals = await db.goal.findMany({
    where: { userId },
    orderBy: { deadline: "asc" }
  });
  return goals;
};

export const addContributionService = async (id: string, amount: number) => {
  const goal = await db.goal.update({
    where: { id },
    data: {
      currentAmount: {
        increment: amount
      }
    }
  });
  return goal;
};
