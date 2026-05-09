import { Request, Response } from "express";
import { 
    createTransactionService,
    updateTransactionService,
    deleteTransactionService
} from "../services/admin.transactions.service";

import {
  CreateTransactionBody,
  CreateTransactionResponse,
  UpdateTransactionBody,
  TransactionResponse,
  ErrorResponse
} from "../types/transactions.types";

import { handlePrismaError } from "../utils/prisma.error";


type ApiResponse<T> = 
    | { success: true; data: T } 
    | ErrorResponse


export const createTransaction = async (
  req: Request<{}, {}, CreateTransactionBody>,
  res: Response<ApiResponse<CreateTransactionResponse>>
): Promise<Response> => {
    try {
        const tx = await createTransactionService(req.body);

        const response: CreateTransactionResponse = {
            id: tx.id,
            userId: tx.userId,
            amount: tx.amount,
            type: tx.type,
            categoryName: tx.categoryName,
            date: tx.date,
            notes: tx.notes
        };

        return res.status(201).json({
            success: true,
            data: response
        });

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "transactions", res);
        if(handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to create transaction"
        });
    }
}

export const updateTransaction = async (
    req: Request<{ id: string }, {}, UpdateTransactionBody>,
    res: Response<ApiResponse<TransactionResponse>>
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const tx = await updateTransactionService(id, req.body);

        return res.status(200).json({
            success: true,
            data: tx
        });

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "transactions", res);
        if(handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to update transaction"
        });
    }
}

export const deleteTransaction = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<TransactionResponse>>
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        await deleteTransactionService(id);

        return res.status(200).json({
            success: true,
            data: {
                id: id,
                msg: `${id} user deleted`
            }
        })

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "transactions", res);
        if (handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to delete user"
        });
    }
}

