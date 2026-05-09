import { db } from "../config/db";

export const createBillService = async (userId: number, data: any) => {
  const bill = await db.bill.create({
    data: {
      ...data,
      userId,
      dueDate: new Date(data.dueDate)
    }
  });
  return bill;
};

export const updateBillService = async (id: string, data: any) => {
  const bill = await db.bill.update({
    where: { id },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    }
  });
  return bill;
};

export const deleteBillService = async (id: string) => {
  await db.bill.delete({
    where: { id }
  });
};

export const getUpcomingBillsService = async (userId: number) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const bills = await db.bill.findMany({
    where: {
      userId,
      dueDate: {
        gte: now,
        lte: thirtyDaysFromNow
      },
      isPaid: false
    },
    orderBy: { dueDate: "asc" }
  });
  return bills;
};

export const getAllBillsService = async (userId: number) => {
  const bills = await db.bill.findMany({
    where: { userId },
    orderBy: { dueDate: "desc" }
  });
  return bills;
};

export const markBillAsPaidService = async (id: string) => {
  const bill = await db.bill.update({
    where: { id },
    data: { isPaid: true }
  });
  return bill;
};
