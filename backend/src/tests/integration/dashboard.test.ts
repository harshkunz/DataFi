import request from "supertest";
import express from "express";
import router from "../../routes/dashboard.routes";

jest.mock("../../middlewares/auth.middleware", () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { id: 1, role: "ADMIN" };
        next();
    },
    roleAuthorize: () => (req: any, res: any, next: any) => {
        next();
    }
}));

const app = express();
app.use(express.json());

app.use("/dashboard", router);


describe("Dashboard API Endpoint", () => {

    // ✅ 
    it("GET /transactions should return paginated data", async () => {
        const res = await request(app)
            .get("/dashboard/transactions?page=1&limit=3");
        
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("meta");
        expect(res.body.data).toHaveProperty("data");
    })

    // ✅ 
    it("GET /filter/records should return filtered data", async () => {
        const res = await request(app)
            .get("/dashboard/filter/records?type=INCOME");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    })

    // ❌
    it("GET /filter/records should fail with invalid query", async () => {
        const res = await request(app)
            .get("/dashboard/filter/records?amount=xyz");

        expect(res.status).toBe(400);
    })

    // ✅
    it("GET /search/records should return searched data", async () => {
        const res = await request(app)
            .get("/dashboard/search/records?page=1&limit=3&categoryName=book");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("meta");
        expect(res.body.data).toHaveProperty("data");
    })
    
});