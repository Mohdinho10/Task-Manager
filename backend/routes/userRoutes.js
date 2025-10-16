import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserProfile,
  getUsers,
  logout,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

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

// ✅ Public routes
router.post("/", upload.single("profileImage"), createUser);
// router.post("/register", upload.single("profileImage"), register);

// ✅ Authenticated user routes
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getUserProfile);
router.put(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateUserProfile
);

// ✅ Admin-only routes
router.get("/", verifyToken, verifyAdmin, getUsers);
router.get("/:id", verifyToken, verifyAdmin, getUser);
router.put("/:id", verifyToken, verifyAdmin, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

// ✅ Moved to avoid conflict
router.get("/profile/:email", getUserByEmail);

export default router;
