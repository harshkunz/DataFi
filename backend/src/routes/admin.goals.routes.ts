import { Router } from "express";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  getAllGoals,
  addContribution
} from "../controllers/admin.goals.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { roleAuthorize } from "../middlewares/role.authorize";

const router = Router();

router.post("/", authenticate, roleAuthorize("ADMIN"), createGoal);
router.put("/:id", authenticate, roleAuthorize("ADMIN"), updateGoal);
router.delete("/:id", authenticate, roleAuthorize("ADMIN"), deleteGoal);
router.get("/", authenticate, roleAuthorize("ADMIN"), getAllGoals);
router.patch("/:id/contribute", authenticate, roleAuthorize("ADMIN"), addContribution);

export default router;
