import { Request, Response } from "express";
import {
  createRecurringService,
  updateRecurringService,
  deleteRecurringService,
  getAllRecurringService
} from "../services/admin.recurring.service";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; msg: string };

export const createRecurring = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const recurring = await createRecurringService(req.user!.id, req.body);
    return res.status(201).json({
      success: true,
      data: recurring
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to create recurring transaction"
    });
  }
};

export const updateRecurring = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    const recurring = await updateRecurringService(id, req.body);
    return res.status(200).json({
      success: true,
      data: recurring
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update recurring transaction"
    });
  }
};

export const deleteRecurring = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteRecurringService(id);
    return res.status(200).json({
      success: true,
      data: { msg: "Recurring transaction deleted successfully" }
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to delete recurring transaction"
    });
  }
};

export const getAllRecurring = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const recurring = await getAllRecurringService(req.user!.id);
    return res.status(200).json({
      success: true,
      data: recurring
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch recurring transactions"
    });
  }
};
