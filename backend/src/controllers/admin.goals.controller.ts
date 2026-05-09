import { Request, Response } from "express";
import {
  createGoalService,
  updateGoalService,
  deleteGoalService,
  getAllGoalsService,
  addContributionService
} from "../services/admin.goals.service";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; msg: string };

export const createGoal = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const goal = await createGoalService(req.user!.id, req.body);
    return res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to create goal"
    });
  }
};

export const updateGoal = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    const goal = await updateGoalService(id, req.body);
    return res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update goal"
    });
  }
};

export const deleteGoal = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteGoalService(id);
    return res.status(200).json({
      success: true,
      data: { msg: "Goal deleted successfully" }
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to delete goal"
    });
  }
};

export const getAllGoals = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const goals = await getAllGoalsService(req.user!.id);
    return res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch goals"
    });
  }
};

export const addContribution = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const goal = await addContributionService(id, amount);
    return res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to add contribution"
    });
  }
};
