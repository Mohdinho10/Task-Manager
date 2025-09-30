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
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Create task (admin only)
router.post("/", isAuthenticated, isAdmin, createTask);

// Protect all routes below
router.use(isAuthenticated);

// Dashboard
router.get("/dashboard", getDashboardData);
router.get("/user", getUserDashboardData);

// Task list
router.get("/tasks", getTasks);

// Task detail and operations
router.get("/:id", getTask);
router.put("/:id", isAdmin, updateTask);
router.delete("/:id", isAdmin, deleteTask);

// Task-specific updates (status & checklist)
router.put("/:id/status", updateTaskStatus); // restrict if needed
router.put("/:id/todo", updateTaskCheckList); // restrict if needed

// Comments
router.route("/:id/comments").get(getComments).post(addComment);

export default router;
