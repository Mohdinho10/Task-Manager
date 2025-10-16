import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getNotifications);
router.put("/:id/read", verifyToken, markAsRead);

export default router;
