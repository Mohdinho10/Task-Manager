import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FiInbox } from "react-icons/fi"; // For empty state icon
import { useGetTasksQuery } from "../../slices/taskApiSlice";
import { useLazyExportTasksReportQuery } from "../../slices/reportSlice";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";
import Loader from "../../components/Loader";

function ManageTasks() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetTasksQuery({
    status: filterStatus,
    sort,
    page,
  });

  const [triggerExport] = useLazyExportTasksReportQuery();

  const tasks = data?.tasks || [];
  const tabs = data?.statusSummary || {};
  const pagination = data?.pagination || {};

  const clickHandler = (task) => {
    navigate("/admin/update-task", { state: { taskId: task._id } });
  };

  const downloadReportHandler = async () => {
    try {
      const response = await triggerExport().unwrap();

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasks-report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download task report:", err);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="my-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-medium">My Tasks</h2>
          <button
            className="download-btn flex items-center gap-1 rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100 md:hidden"
            onClick={downloadReportHandler}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <TaskStatusTabs
              tabs={[
                { label: "all", display: "All", count: tabs.all || 0 },
                {
                  label: "pending",
                  display: "Pending",
                  count: tabs.pendingTasks || 0,
                },
                {
                  label: "inProgress",
                  display: "In Progress",
                  count: tabs.inProgressTasks || 0,
                },
                {
                  label: "completed",
                  display: "Completed",
                  count: tabs.completedTasks || 0,
                },
              ]}
              activeTab={filterStatus}
              setActiveTab={(status) => {
                setPage(1);
                setFilterStatus(status);
              }}
            />

            <button
              className="download-btn hidden items-center gap-1 rounded border bg-white px-3 py-1 text-sm hover:bg-gray-100 lg:flex"
              onClick={downloadReportHandler}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium">Sort By:</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-input w-auto text-sm"
        >
          <option value="-createdAt">Newest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task List or Empty State */}
      {tasks.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tasks.map((item) => (
            <TaskCard
              key={item._id}
              {...item}
              assignedTo={item.assignedTo}
              clickHandler={() => clickHandler(item)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 text-gray-500">
          <FiInbox size={60} />
          <p className="text-lg font-semibold">No tasks found.</p>
          <p className="max-w-xs text-center">
            You don&apos;t have any tasks matching the current filter. Try
            adjusting your filters or reload the tasks.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Tasks
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && tasks.length > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">{`Page ${pagination.page} of ${pagination.totalPages}`}</span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageTasks;
