import { Router } from "express";
import {
  createTask,
  deleteTask,
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

// router.post("/", isAuthenticated, isAdmin, createTask);
// router.use(isAuthenticated);
// router.get("/dashboard", getDashboardData);
// router.get("/user", getUserDashboardData);
// router.get("/tasks", getTasks);
// router.get("/:id", getTaskById);
// router.put("/:id", updateTask);
// router.delete("/:id", deleteTask);
// router.put("/:id/status", updateTaskStatus);
// router.put("/:id/todo", updateTaskCheckList);

// Create task (admin only)
router.post("/", isAuthenticated, isAdmin, createTask);

// Protect all routes below
router.use(isAuthenticated);

// Dashboard data
router.get("/dashboard", getDashboardData);
router.get("/user", getUserDashboardData);

// Get all tasks (e.g., for admin or manager)
router.get("/tasks", getTasks);

// Task detail and operations
router.get("/:id", getTask);
router.put("/:id", isAdmin, updateTask);
router.delete("/:id", isAdmin, deleteTask);
router.put("/:id/status", updateTaskStatus); // maybe restricted
router.put("/:id/todo", updateTaskCheckList); // maybe restricted

export default router;
