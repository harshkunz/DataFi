import { db } from "../config/db";
import { Prisma } from "../generated/prisma/client";
import { Role } from "../types/admin.users.types";
import { 
    TransactionResponse,
    TrandResponse,
    FilterQuery,
} from "../types/transactions.types";


// where command
const getWhere = (userId: number, role: Role): Prisma.TransactionWhereInput => {
    return role === "VIEWER" ? { userId } : {};
}


export const getBalanceService = async (
    userId: number,
    role: Role
) => {
    const where = getWhere(userId, role);

    const [income, expense] = await Promise.all([
        db.transaction.aggregate({
            _sum: { amount: true },
            where: { ...where, type: "INCOME" }
        }),

        db.transaction.aggregate({
            _sum: { amount: true },
            where: { ...where, type: "EXPENSE" }
        })
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
    }
};

export const getTransactionTotalTypeService = async (
    userId: number,
    role: Role
) => {
    const where = getWhere(userId, role);

    const result = await db.transaction.groupBy({
        by: ["type"],
        where,
        _sum: { amount: true }
    })

    return result.map((r) => ({
        type: r.type,
        amount: r._sum.amount || 0
    }));
}

export const getRecentService = async (
    userId: number,
    role: Role
) => {
    const where = getWhere(userId, role);

    const result: TransactionResponse[] = await db.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5
    });

    return result;
}

export const getTrendsService = async (
  userId: number,
  role: Role,
  Qtype: "WEEKLY" | "MONTHLY"
) => {
    const where = getWhere(userId, role);

    const txs: TrandResponse[] = await db.transaction.findMany({
        where,
        select: { id: true, amount: true, type: true, date: true }
    })

    const result: Record<string, number> = {};

    txs.forEach(tx => {
        const date = tx.date;
        const type = tx.type;

        const key = 
            Qtype === "MONTHLY"
                ? `${date.getFullYear()} - ${date.getMonth() + 1}`
                : `${date.getFullYear()} -W ${Math.ceil(date.getDate() / 7)}`;

        if(!result[key]) result[key] = 0;

        result[key] += 
            type === "INCOME" ? tx.amount : -tx.amount;
    });

    return result;
};


export const getFilteredRecordsService = async (
  query: FilterQuery
) => {
    const { type, amount, categoryName, startDate, endDate } = query;

    const where: Prisma.TransactionWhereInput = {
        ...(type && { type }),
        ...(amount !== undefined && { amount }),
        ...(categoryName && {
            categoryName: {
                contains: categoryName,
                mode: Prisma.QueryMode.insensitive
            }
        }),
        date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined
        }
    };
    
    const result: TrandResponse[] = await db.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" }
    })

    return result;
};

export const getTransactionsService = async (
    userId: number,
    role: Role,
    page: number,
    limit: number,
    categoryName?: string
) => {
    const baseWhere = getWhere(userId, role);
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {
        ...baseWhere,
        ...(categoryName && {
            categoryName: {
                contains: categoryName,
                mode: Prisma.QueryMode.insensitive
            }
        })
    }
    
    const [txs, total]: [TransactionResponse[], number]  = await Promise.all([
        db.transaction.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        }),

        db.transaction.count({ where })
    ])

    return {
        data: txs,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

