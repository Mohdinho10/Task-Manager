import { Router } from "express";
import {
  exportTasksReport,
  exportUsersReport,
} from "../controllers/reportController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = Router();

router.get("/export/tasks", verifyToken, verifyAdmin, exportTasksReport);
router.get("/export/users", verifyToken, verifyAdmin, exportUsersReport);

export default router;
