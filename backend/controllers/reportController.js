import asyncHandler from "../middleware/asyncHandler.js";
import Task from "../models/taskModel.js";
import ExcelJS from "exceljs";
import User from "../models/userModel.js";

export const exportTasksReport = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("User Tasks Report"); // Fix this line

  worksheet.columns = [
    { header: "Task ID", key: "_id", width: 25 },
    { header: "Title", key: "title", width: 30 },
    { header: "Description", key: "description", width: 50 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Status", key: "status", width: 20 },
    { header: "Due Date", key: "dueDate", width: 20 },
    { header: "Assigned To", key: "assignedTo", width: 30 },
  ];

  tasks.forEach((task) => {
    const assignedTo = task.assignedTo
      .map((user) => `${user.name} (${user.email})`)
      .join(", ");
    worksheet.addRow({
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.toISOString().split("T")[0],
      assignedTo: assignedTo || "unassigned",
    });
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tasks-report.xlsx"
  );
  return workbook.xlsx.write(res).then(() => res.status(200).end());
});

// @desc    Export user tasks report as Excel
// @route   GET /api/reports/export/users
// @access  Admin
export const exportUsersReport = asyncHandler(async (req, res) => {
  const users = await User.find({});
  const tasks = await Task.find({});

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("User Tasks Report"); // ✅ Fixed line

  worksheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Role", key: "role", width: 15 },
    { header: "Pending Tasks", key: "pending", width: 15 },
    { header: "In Progress Tasks", key: "inProgress", width: 20 },
    { header: "Completed Tasks", key: "completed", width: 20 },
  ];

  users.forEach((user) => {
    const userTasks = tasks.filter((task) =>
      task.assignedTo.some((assignedUserId) => assignedUserId.equals(user._id))
    );

    const pending = userTasks.filter(
      (task) => task.status === "pending"
    ).length;
    const inProgress = userTasks.filter(
      (task) => task.status === "inProgress"
    ).length;
    const completed = userTasks.filter(
      (task) => task.status === "completed"
    ).length;

    worksheet.addRow({
      name: user.name,
      email: user.email,
      role: user.role,
      pending,
      inProgress,
      completed,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=users-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});
