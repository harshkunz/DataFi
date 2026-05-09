import { Router } from 'express';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/admin.transactions.controller";

import { roleAuthorize } from "../middlewares/role.authorize";
import { validate } from "../middlewares/validate";
import { authenticate } from '../middlewares/auth.middleware';

import {
  createTransactionValidation,
  updateTransactionValidation,
  deleteTransactionValidation
} from "../validations/admin.transactions.validation";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Transactions
 *   description: Transaction Management APIs
 */


/**
 * @swagger
 * /api/admin/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Admin Transactions]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionBody'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.post(
  "/",
  authenticate,
  roleAuthorize("ADMIN"),
  createTransactionValidation,
  validate,
  createTransaction
);

/**
 * @swagger
 * /api/admin/transactions/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Admin Transactions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransactionBody'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.patch(
  "/:id",
  authenticate,
  roleAuthorize("ADMIN"),
  updateTransactionValidation,
  validate,
  updateTransaction
);

/**
 * @swagger
 * /api/admin/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Admin Transactions]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     msg:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.delete(
  "/:id",
  authenticate,
  roleAuthorize("ADMIN"),
  deleteTransactionValidation,
  validate,
  deleteTransaction
);

export default router;