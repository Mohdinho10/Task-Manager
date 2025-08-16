import asyncHandler from "../middleware/asyncHandler.js";
import Task from "../models/taskModel.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  // Fetch statistics
  const totalTasks = await Task.countDocuments();
  const pendingTasks = await Task.countDocuments({ status: "pending" });
  const completedTasks = await Task.countDocuments({ status: "completed" });
  const overdueTasks = await Task.countDocuments({
    status: { $ne: "completed" },
    dueDate: { $lt: new Date() },
  });

  //   Ensure all possible status are included
  const taskStatuses = ["pending", "inProgress", "completed"];
  const taskDistributionRaw = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\$+/g, ""); // Remove spaces for response keys
    acc[formattedKey] =
      taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
  }, {});

  taskDistribution["All"] = totalTasks; // Add total count to task distribution

  // Ensure all priority levels are included
  const taskPriorities = ["low", "medium", "high"];
  const taskPriorityLevelsRaw = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);
  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {});

  // Fetch 10 recent tasks
  const recentTasks = await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  res.status(200).json({
    statistics: {
      totalTasks,
      overdueTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
    },
    charts: {
      taskDistribution,
      taskPriorityLevels,
    },
    recentTasks,
  });
});

export const getUserDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch Statistics for user-specific tasks
  const totalTasks = await Task.countDocuments({ assignedTo: userId });
  const pendingTasks = await Task.countDocuments({
    assignedTo: userId,
    status: "pending",
  });
  const completedTasks = await Task.countDocuments({
    assignedTo: userId,
    status: "completed",
  });
  const overdueTasks = await Task.countDocuments({
    assignedTo: userId,
    status: { $ne: "completed" },
    dueDate: { $lt: new Date() },
  });

  // Task Distribution by status
  const taskStatuses = ["pending", "inProgress", "completed"];
  const taskDistributionRaw = await Task.aggregate([
    { $match: { assignedTo: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\$+/g, ""); // Remove spaces for response keys
    acc[formattedKey] =
      taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
  }, {});

  taskDistribution["All"] = totalTasks; // Add total count to task distribution

  // Ensure all priority levels are included
  const taskPriorities = ["low", "medium", "high"];
  const taskPriorityLevelsRaw = await Task.aggregate([
    { $match: { assignedTo: userId } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);
  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {});

  // Fetch 10 recent tasks
  const recentTasks = await Task.find({ assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  res.status(200).json({
    statistics: {
      totalTasks,
      overdueTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
    },
    charts: {
      taskDistribution,
      taskPriorityLevels,
    },
    recentTasks,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  let filter = {};
  if (status) filter.status = status;

  const isAdmin = req.user.role === "admin";
  const baseQuery = isAdmin ? filter : { ...filter, assignedTo: req.user._id };

  // Fetch tasks
  let tasks = await Task.find(baseQuery)
    .populate("assignedTo", "name email profileImageUrl")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  tasks = await Promise.all(
    tasks.map(async (task) => {
      const completedTodoCount = task.todoChecklist.filter(
        (item) => item.completed
      ).length;
      return { ...task.toObject(), completedTodoCount };
    })
  );

  // Total counts
  const totalTasks = await Task.countDocuments(baseQuery);

  // Status summary
  const [pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
    Task.countDocuments({
      status: "pending",
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    }),
    Task.countDocuments({
      status: "inProgress",
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    }),
    Task.countDocuments({
      status: "completed",
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    }),
  ]);

  res.json({
    tasks,
    statusSummary: {
      all: totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    },
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl"
  );

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.status(200).json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    attachments,
    todoChecklist,
  } = req.body;

  if (!Array.isArray(assignedTo)) {
    return res.status(400).json({ message: "Assigned to must be an array" });
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    attachments,
    todoChecklist,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  // task.assignedTo = req.body.assignedTo || task.assignedTo;
  task.attachments = req.body.attachments || task.attachments;
  task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

  if (req.body.assignedTo) {
    if (!Array.isArray(req.body.assignedTo)) {
      return res.status(400).json({ message: "Assigned to must be an array" });
    }
    task.assignedTo = req.body.assignedTo;
  }
  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.status(200).json({ message: "Task deleted successfully" });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const isAssigned = task.assignedTo.some(
    (userId) => userId.toString() === req.user._id.toString()
  );

  // Allow only assigned users or admins to update status
  if (!isAssigned && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to update this task's status");
  }

  // Update the status
  if (status) {
    task.status = status;

    // If completed, mark all todos complete and set progress to 100%
    if (status === "completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }
  }

  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

// @desc    Update Task Checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private (assigned users or admin)
export const updateTaskCheckList = asyncHandler(async (req, res) => {
  const { todoChecklist } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Allow update only if user is assigned or is an admin
  const isAssigned = task.assignedTo.some((userId) =>
    userId.equals(req.user._id)
  );

  if (!isAssigned && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to update this task's checklist");
  }

  task.todoChecklist = todoChecklist;

  // Auto-update progress
  const completedCount = task.todoChecklist.filter(
    (item) => item.completed
  ).length;
  const totalItems = task.todoChecklist.length;

  task.progress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Auto-update task status
  if (task.progress === 100) {
    task.status = "completed";
  } else if (task.progress > 0) {
    task.status = "inProgress";
  } else {
    task.status = "pending";
  }

  await task.save();

  const updatedTask = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl"
  );

  res.status(200).json(updatedTask);
});
