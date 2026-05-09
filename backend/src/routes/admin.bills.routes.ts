import { Router } from "express";
import {
  createBill,
  updateBill,
  deleteBill,
  getUpcomingBills,
  getAllBills,
  markBillAsPaid
} from "../controllers/admin.bills.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { roleAuthorize } from "../middlewares/role.authorize";

const router = Router();

router.post("/", authenticate, roleAuthorize("ADMIN"), createBill);
router.put("/:id", authenticate, roleAuthorize("ADMIN"), updateBill);
router.delete("/:id", authenticate, roleAuthorize("ADMIN"), deleteBill);
router.get("/upcoming", authenticate, roleAuthorize("ADMIN"), getUpcomingBills);
router.get("/", authenticate, roleAuthorize("ADMIN"), getAllBills);
router.patch("/:id/paid", authenticate, roleAuthorize("ADMIN"), markBillAsPaid);

export default router;
