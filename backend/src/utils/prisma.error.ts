import { Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export const handlePrismaError = (
  error: unknown,
  key: string,
  res: Response
): Response | null => {
  if (error instanceof PrismaClientKnownRequestError) {
    
    if (key === "users" && error.code === "P2002") {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    if (key === "users" && error.code === "P2025") {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (key === "transactions" && error.code === "P2002") {
      return res.status(400).json({
        success: false,
        msg: "Duplicate value violates unique constraint",
      });
    }

    if (key === "transactions" && error.code === "P2025") {
      return res.status(404).json({
        success: false,
        msg: "Record not found",
      });
    }
  
  }

  return null;
};