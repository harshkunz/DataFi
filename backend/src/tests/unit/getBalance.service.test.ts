import { getBalanceService } from "../../services/dashboard.service";
import { db } from "../../config/db";

jest.mock("../../config/db", () => ({
    db: {
        transaction: {
            aggregate: jest.fn()
        }
    }
}));

describe("getBalanceService", () => {
    it("should return correct netBalance", async () => {
        (db.transaction.aggregate as jest.Mock)
            .mockResolvedValueOnce({ _sum: { amount: 1000 }})
            .mockResolvedValueOnce({ _sum: { amount: 400 }})

        const result = await getBalanceService(1, "VIEWER");

        expect(result).toEqual({
            totalIncome: 1000,
            totalExpense: 400,
            netBalance: 600
        })
    })
});