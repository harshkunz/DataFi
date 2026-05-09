import { db } from "../config/db";

const calculateNextDate = (startDate: Date, frequency: string): Date => {
  const next = new Date(startDate);
  switch (frequency) {
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
};

export const createRecurringService = async (userId: number, data: any) => {
  const startDate = new Date(data.startDate);
  const nextDate = calculateNextDate(startDate, data.frequency);

  const recurring = await db.recurringTransaction.create({
    data: {
      ...data,
      userId,
      startDate,
      nextDate,
      frequency: data.frequency
    }
  });
  return recurring;
};

export const updateRecurringService = async (id: string, data: any) => {
  const updateData: any = { ...data };
  
  if (data.startDate) {
    updateData.startDate = new Date(data.startDate);
    if (data.frequency) {
      updateData.nextDate = calculateNextDate(
        new Date(data.startDate),
        data.frequency
      );
    }
  }

  const recurring = await db.recurringTransaction.update({
    where: { id },
    data: updateData
  });
  return recurring;
};

export const deleteRecurringService = async (id: string) => {
  await db.recurringTransaction.delete({
    where: { id }
  });
};

export const getAllRecurringService = async (userId: number) => {
  const recurring = await db.recurringTransaction.findMany({
    where: { userId, isActive: true },
    orderBy: { nextDate: "asc" }
  });
  return recurring;
};
