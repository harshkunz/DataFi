import { getTransactionsService } from "../../services/dashboard.service";
import { db } from "../../config/db";

jest.mock("../../config/db", () => ({
  db: {
    transaction: {
      findMany: jest.fn(),
      count: jest.fn()
    }
  }
}));

describe("getTransactionsService", () => {
    it("should return paginated transactions", async () => {
        (db.transaction.findMany as jest.Mock)
            .mockResolvedValue([
                { id: 1, amount: 100 },
                { id: 2, amount: 200 },
                { id: 3, amount: 300 }
            ]);

        (db.transaction.count as jest.Mock).mockResolvedValue(5);

        const result = await getTransactionsService(1, "ADMIN", 1, 5);

        expect(result.data.length).toBe(3);
        expect(result.meta.total).toBe(5);
    })
});