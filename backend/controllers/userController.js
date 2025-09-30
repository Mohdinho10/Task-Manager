import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // multer stores the file info here:
  const file = req.file;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let profileImageUrl = null;
  if (file) {
    // Assuming your static files are served from /uploads
    profileImageUrl = `/uploads/${file.filename}`;
  }

  const user = await User.create({
    name,
    email,
    password,
    profileImageUrl,
  });

  // checking if there's user
  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email and password does not exists
  if (!email || !password) {
    throw new Error("Please provide email and password", 401);
  }

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateToken(res, user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl || null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user); // ✅ phone will be included automatically
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, password, phone, availability } = req.body;

  if (req.file) {
    user.profileImageUrl = `/uploads/${req.file.filename}`;
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error("Email is already in use by another account");
    }
    user.email = email;
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;

  if (availability) {
    user.availability = availability; // ✅ update availability
    user.lastSeen = Date.now(); // optional: update last seen
  }

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    availability: updatedUser.availability,
    lastSeen: updatedUser.lastSeen,
    profileImageUrl: updatedUser.profileImageUrl,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, profileImageUrl, password } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if new email is provided and belongs to another user
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error("Email is already in use by another account");
    }
    user.email = email;
  }

  user.name = name || user.name;
  user.role = role || user.role;
  user.profileImageUrl = profileImageUrl || user.profileImageUrl;

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
    },
  });
});

// export const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({ role: "member" }).select("-password");

//   //   Add tasks counts to each user
//   const usersWithTaskCounts = await Promise.all(
//     users.map(async (user) => {
//       const pendingTasks = await Task.countDocuments({
//         assignedTo: user._id,
//         status: "pending",
//       });
//       const inProgressTasks = await Task.countDocuments({
//         assignedTo: user._id,
//         status: "inProgress",
//       });
//       const completedTasks = await Task.countDocuments({
//         assignedTo: user._id,
//         status: "completed",
//       });

//       return {
//         ...user._doc,
//         pendingTasks,
//         inProgressTasks,
//         completedTasks,
//       };
//     })
//   );
//   res.json(usersWithTaskCounts);
// });

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "member" }).select("-password");

  // Add tasks counts to each user
  const usersWithTaskCounts = await Promise.all(
    users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "pending",
      });
      const inProgressTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "inProgress",
      });
      const completedTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "completed",
      });

      return {
        ...user._doc,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        availability: user.availability || "offline", // default if missing
        role: user.role || "member", // fallback if role not set
      };
    })
  );

  res.json(usersWithTaskCounts);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent deleting other admins (optional but recommended)
  if (user.role === "admin") {
    res.status(403);
    throw new Error("Cannot delete admin users");
  }

  await user.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // expires immediately
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({ message: "Logged out successfully" });
});
