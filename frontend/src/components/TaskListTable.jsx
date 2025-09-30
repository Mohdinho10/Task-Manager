import moment from "moment";
import { formatPriorityLabel, formatStatusLabel } from "../utils/helper";

function TaskListTable({ tableData }) {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg:green-100 text-green-500 border border-green-200 ";
      case "pending":
        return "bg:purple-100 text-purple-500 border border-purple-200 ";
      case "inProgress":
        return "bg:cyan-100 text-cyan-500 border border-cyan-200 ";
      default:
        "bg:gray-100 text-gray-500 border border-gray-200 ";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg:red-100 text-red-500 border border-red-200 ";
      case "medium":
        return "bg:orange-100 text-orange-500 border border-orange-200 ";
      case "low":
        return "bg:green-100 text-green-500 border border-green-200 ";
    }
  };
  return (
    <div className="mt-3 overflow-x-auto rounded-lg p-0">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-3 text-[13px] font-medium text-gray-800">
              Name
            </th>
            <th className="px-4 py-3 text-[13px] font-medium text-gray-800">
              Status
            </th>
            <th className="px-4 py-3 text-[13px] font-medium text-gray-800">
              Priority
            </th>
            <th className="hidden px-4 py-3 text-[13px] font-medium text-gray-800 md:table-cell">
              Created On
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="mx-4 my-3 line-clamp-1 overflow-hidden text-[13px] text-gray-700">
                {task.title}{" "}
              </td>
              <td className="px-2 py-4">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs ${getStatusBadgeColor(task.status)}`}
                >
                  {formatStatusLabel(task.status)}
                </span>
              </td>
              <td className="px-2 py-4">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs ${getPriorityBadgeColor(task.priority)}`}
                >
                  {formatPriorityLabel(task.priority)}
                </span>
              </td>

              <td className="hidden px-2 py-4 text-[13px] text-nowrap text-gray-700 md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskListTable;
