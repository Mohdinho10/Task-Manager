import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
import Progress from "../Progress";

function TaskCard({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  todoChecklist,
  completedTodoCount,
  attachmentCount = 0,
  clickHandler,
}) {
  const getStatusTagColor = () => {
    switch (status) {
      case "inProgress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  // Friendly labels
  const displayStatusMap = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
  };

  const displayPriorityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <div
      className="cursor-pointer rounded-xl border border-gray-200/50 bg-white py-4 shadow-md shadow-gray-100"
      onClick={clickHandler}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} rounded px-4 py-0.5`}
        >
          {displayStatusMap[status] || status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} rounded px-4 py-0.5`}
        >
          {displayPriorityMap[priority] || priority} Priority
        </div>
      </div>
      <div
        className={`border-l-[3px] px-4 ${
          status === "inProgress"
            ? "border-cyan-500"
            : status === "completed"
              ? "border-indigo-500"
              : "border-violet-500"
        }`}
      >
        <p className="mt-4 line-clamp-2 text-sm font-medium text-gray-800">
          {title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-[18px] text-gray-500">
          {description}
        </p>
        <p className="mt-2 mb-2 text-[13px] leading-[18px] font-medium text-gray-700/80">
          Task Done:
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>
      <div className="px-4">
        <div className="my-1 flex items-center justify-between">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <AvatarGroup avatars={assignedTo || []} maxVisible={3} />
          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1">
              <LuPaperclip className="text-primary" />
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
