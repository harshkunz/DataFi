import { query } from "express-validator";

export const trendValidation = [
  query("type").exists()
    .toUpperCase()
    .isIn(["WEEKLY", "MONTHLY"])
    .withMessage("Type must be WEEKLY or MONTHLY")
];

export const filterValidation = [
  query("type").optional().isIn(["INCOME", "EXPENSE"]),
  query("amount")
    .optional()
    .isFloat().withMessage("Amount must be a number")
    .toFloat(),
  query("categoryName").optional().isString(),
  query("startDate").optional().isISO8601(),
  query("endDate").optional().isISO8601(),
];

export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 & 50"),

  query("categoryName")
    .optional()
    .isString().withMessage("must be string")
    .trim()
    .isLength({ min: 3 }).withMessage("cannot be empty")
];