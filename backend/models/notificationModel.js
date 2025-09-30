import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["task", "comment", "system"],
      default: "system",
    },
    read: { type: Boolean, default: false },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // optional link
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
