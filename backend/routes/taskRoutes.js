import { Router } from "express";
import {
  addComment,
  createTask,
  deleteTask,
  getComments,
  getDashboardData,
  getTask,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskCheckList,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = Router();

// Create task (admin only)
router.post("/", verifyToken, verifyAdmin, createTask);

// Protect all routes below
router.use(verifyToken);

// Dashboard
router.get("/dashboard", getDashboardData);
router.get("/user", getUserDashboardData);

// Task list
router.get("/tasks", getTasks);

// Task detail and operations
router.get("/:id", getTask);
router.put("/:id", verifyAdmin, updateTask);
router.delete("/:id", verifyAdmin, deleteTask);

// Task-specific updates (status & checklist)
router.put("/:id/status", updateTaskStatus); // restrict if needed
router.put("/:id/todo", updateTaskCheckList); // restrict if needed

// Comments
router.route("/:id/comments").get(getComments).post(addComment);

export default router;
