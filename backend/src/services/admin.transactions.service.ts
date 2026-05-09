import { db } from "../config/db";
import { 
    CreateTransactionBody,
    UpdateTransactionBody
} from "../types/transactions.types";


export const createTransactionService = async (
    data: CreateTransactionBody
) => {
    const tx = await db.transaction.create({
        data: {
            ...data,
            date: new Date(data.date)
        }
    })

    return tx;
}

export const updateTransactionService = async (
  id: number,
  data: UpdateTransactionBody
) => {
    const tx = await db.transaction.update({
        where: { id },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined
        }
    })

    return tx;
}

export const deleteTransactionService = async (id: number) => {
  await db.transaction.delete({
    where: { id }
  });

  return;
};