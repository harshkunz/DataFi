import { Router } from "express";
import {
  createRecurring,
  updateRecurring,
  deleteRecurring,
  getAllRecurring
} from "../controllers/admin.recurring.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { roleAuthorize } from "../middlewares/role.authorize";

const router = Router();

router.post("/", authenticate, roleAuthorize("ADMIN"), createRecurring);
router.put("/:id", authenticate, roleAuthorize("ADMIN"), updateRecurring);
router.delete("/:id", authenticate, roleAuthorize("ADMIN"), deleteRecurring);
router.get("/", authenticate, roleAuthorize("ADMIN"), getAllRecurring);

export default router;
