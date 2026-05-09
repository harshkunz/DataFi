import { body, param } from "express-validator";

export const createUserValidation = [
  body("name").isLength({min: 3, max:12 }),
  body("email").isEmail().toLowerCase(),
  body("password").isLength({ min: 4 }),
  body("role").isIn(["ADMIN", "ANALYST", "VIEWER"]),
];

export const updateRoleValidation = [
  param("id").isInt(),
  body("role").isIn(["ADMIN", "ANALYST", "VIEWER"]),
];

export const updateStatusValidation = [
  param("id").isInt(),
  body("status").isIn(["ACTIVE", "INACTIVE"]),
];

export const deleteUserValidation = [
  param("id").isInt(),
];