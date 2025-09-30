import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notificationModel.js";

// Get notifications for logged-in user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notifications);
});

// Mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  notification.read = true;
  await notification.save();
  res.json(notification);
});
