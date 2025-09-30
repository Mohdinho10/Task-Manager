import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import {
  exportTasksReport,
  exportUsersReport,
} from "../controllers/reportController.js";

const router = Router();

router.get("/export/tasks", isAuthenticated, isAdmin, exportTasksReport);
router.get("/export/users", isAuthenticated, isAdmin, exportUsersReport);

export default router;
