import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUserProfile,
  getUsers,
  login,
  logout,
  register,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Public routes
router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);

// Authenticated user routes
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put(
  "/profile",
  isAuthenticated,
  upload.single("profileImage"),
  updateUserProfile
);

// Admin-only routes
router.get("/", isAuthenticated, isAdmin, getUsers);
router.get("/:id", isAuthenticated, isAdmin, getUser);
router.put("/:id", isAuthenticated, isAdmin, updateUser);
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

export default router;
