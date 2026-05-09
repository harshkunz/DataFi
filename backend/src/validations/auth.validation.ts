import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 4 }).withMessage("Password too short"),
];