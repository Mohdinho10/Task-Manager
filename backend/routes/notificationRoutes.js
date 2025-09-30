import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/:id/read", isAuthenticated, markAsRead);

export default router;
