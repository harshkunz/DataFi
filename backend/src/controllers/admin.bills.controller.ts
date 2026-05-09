import { Request, Response } from "express";
import {
  createBillService,
  updateBillService,
  deleteBillService,
  getUpcomingBillsService,
  getAllBillsService,
  markBillAsPaidService
} from "../services/admin.bills.service";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; msg: string };

export const createBill = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const bill = await createBillService(req.user!.id, req.body);
    return res.status(201).json({
      success: true,
      data: bill
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to create bill"
    });
  }
};

export const updateBill = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    const bill = await updateBillService(id, req.body);
    return res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to update bill"
    });
  }
};

export const deleteBill = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    await deleteBillService(id);
    return res.status(200).json({
      success: true,
      data: { msg: "Bill deleted successfully" }
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to delete bill"
    });
  }
};

export const getUpcomingBills = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const bills = await getUpcomingBillsService(req.user!.id);
    return res.status(200).json({
      success: true,
      data: bills
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch upcoming bills"
    });
  }
};

export const getAllBills = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const bills = await getAllBillsService(req.user!.id);
    return res.status(200).json({
      success: true,
      data: bills
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch bills"
    });
  }
};

export const markBillAsPaid = async (
  req: Request,
  res: Response<ApiResponse<any>>
): Promise<Response> => {
  try {
    const { id } = req.params;
    const bill = await markBillAsPaidService(id);
    return res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      msg: "Failed to mark bill as paid"
    });
  }
};
