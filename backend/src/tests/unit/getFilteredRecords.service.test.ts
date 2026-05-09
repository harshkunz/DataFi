import { getFilteredRecordsService } from "../../services/dashboard.service";
import { db } from "../../config/db";

jest.mock("../../config/db", () => ({
    db: {
        transaction: {
            findMany: jest.fn()
        }
    }
}));

describe("getFilteredRecordsService", () => {
    it("should return filtered records", async () => {
        (db.transaction.findMany as jest.Mock)
            .mockResolvedValue([
                { id: 1, type: "EXPENSE", amount: 1000 },
            ])

        const result = await getFilteredRecordsService({
            type: "EXPENSE"
        });

        expect(result.length).toBe(1);
        expect(result[0].amount).toBe(1000);
    })
});