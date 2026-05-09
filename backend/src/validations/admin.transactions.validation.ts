import { body, param } from "express-validator";

export const createTransactionValidation = [
  body("userId").isInt(),
  body("amount").isFloat(),
  body("type").isIn(["INCOME", "EXPENSE"]),
  body("categoryName").isLength({min: 1, max:20 }).toUpperCase(),
  body("date").isISO8601()
];

export const updateTransactionValidation = [
  param("id").isInt(),
  body("amount").optional().isFloat(),
  body("type").optional().isIn(["INCOME", "EXPENSE"]),
  body("categoryName").optional().isLength({min: 1, max:20 }).toUpperCase(),
  body("date").optional().isISO8601()
];

export const deleteTransactionValidation = [
  param("id").isInt()
];