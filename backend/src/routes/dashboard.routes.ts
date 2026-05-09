import { Router } from 'express';
import {
  getBalance,
  getTransactionTotalType,
  getRecent,
  getTrends,
  getFilteredRecords,
  getTransactions
} from "../controllers/dashboard.controller";

import { roleAuthorize } from "../middlewares/role.authorize";
import { validate } from "../middlewares/validate";
import { authenticate } from '../middlewares/auth.middleware';

import {
    trendValidation,
    filterValidation,
    paginationValidation
} from "../validations/dashboard.validation";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard APIs
 */


/**
 * @swagger
 * /api/dashboard/balance:
 *   get:
 *     summary: Get total income, expense and net balance
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BalanceResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/balance",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST", "VIEWER"),
    getBalance
)

/**
 * @swagger
 * /api/dashboard/type:
 *   get:
 *     summary: Get total transactions grouped by type (INCOME / EXPENSE)
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Transaction totals by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TotalByType'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/type",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST", "VIEWER"),
    getTransactionTotalType
)

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent transactions (latest 5)
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Recent transactions fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/recent",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST", "VIEWER"),
    getRecent
)

/**
 * @swagger
 * /api/dashboard/trend:
 *   get:
 *     summary: Get transaction trends (weekly or monthly)
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [WEEKLY, MONTHLY]
 *         description: Trend type (WEEKLY or MONTHLY)
 *     responses:
 *       200:
 *         description: Transaction trends fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                     example: 5000
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/trend",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST", "VIEWER"),
    trendValidation,
    validate,
    getTrends
)

// Pagination

/**
 * @swagger
 * /api/dashboard/transactions:
 *   get:
 *     summary: Get paginated transactions
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: Filter by category name (optional)
 *     responses:
 *       200:
 *         description: Paginated transactions fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/transactions",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST", "VIEWER"),
    paginationValidation,
    validate,
    getTransactions
)

// Filtering

/**
 * @swagger
 * /api/dashboard/filter/records:
 *   get:
 *     summary: Filter transactions based on multiple conditions
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         description: Filter by exact amount
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Filtered transactions fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/filter/records",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST"),
    filterValidation,
    validate,
    getFilteredRecords
)

// Searching

/**
 * @swagger
 * /api/dashboard/search/records:
 *   get:
 *     summary: Search transactions by category name (with pagination)
 *     tags: [Dashboard]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword for category name
 *     responses:
 *       200:
 *         description: Search results fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.get(
    "/search/records",
    authenticate,
    roleAuthorize("ADMIN", "ANALYST"),
    paginationValidation,
    validate,
    getTransactions
)


export default router;

