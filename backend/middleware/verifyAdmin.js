import User from "../models/userModel.js";

export const verifyAdmin = async (req, res, next) => {
  const email = req.user?.email; // ✅ use req.user not req.decoded

  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized - no email in token" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - admin only" });
  }

  next();
};
