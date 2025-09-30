import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "../../slices/taskApiSlice";
import { toast } from "react-hot-toast";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropdown from "../../components/SelectDropdown";
import SelectUsers from "../../components/SelectUsers";
import TodoListInput from "../../components/TodoListInput";
import AddAttachmentInput from "../../components/AddAttachmentInput";
import Loader from "../../components/Loader";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "../../components/Modal";

// ✅ Import DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // API hooks
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const { data, isLoading: isTaskLoading } = useGetTaskQuery(taskId, {
    skip: !taskId,
  });

  useEffect(() => {
    if (data) {
      setCurrentTask(data);
      setTaskData({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate?.split("T")[0] || "",
        assignedTo: data.assignedTo || [],
        todoChecklist: data.todoChecklist?.map((item) => item.text) || [],
        attachments: data.attachments || [],
      });
    }
  }, [data]);

  const changeValueHandler = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete task");
    } finally {
      setOpenDeleteAlert(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) return toast.error("Title is required");
    if (!taskData.description.trim())
      return toast.error("Description is required");
    if (!taskData.dueDate) return toast.error("Due date is required");
    if (taskData.assignedTo.length === 0)
      return toast.error("Please assign at least one user");

    try {
      const formattedChecklist = taskData.todoChecklist.map((item, index) => ({
        text: item,
        completed: currentTask?.todoChecklist?.[index]?.completed || false,
      }));

      if (taskId) {
        await updateTask({
          id: taskId,
          data: {
            ...taskData,
            dueDate: new Date(taskData.dueDate).toISOString(),
            todoChecklist: formattedChecklist,
          },
        }).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await createTask({
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: formattedChecklist.map((item) => ({
            ...item,
            completed: false,
          })),
        }).unwrap();
        toast.success("Task created successfully!");
      }

      clearData();
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (isTaskLoading) return <Loader />;

  return (
    <div className="mt-5">
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4">
        <div className="form-card col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">
              {taskId ? "Update Task" : "Create Task"}
            </h2>
            {taskId && (
              <button
                className="flex cursor-pointer items-center gap-1.5 rounded border border-rose-100 bg-rose-50 px-2 py-1 text-[13px] font-medium text-rose-500 hover:border-rose-300"
                onClick={() => setOpenDeleteAlert(true)}
              >
                <LuTrash2 className="text-base" /> Delete
              </button>
            )}
          </div>

          <div className="mt-4">
            <label className="text-xs font-medium text-slate-600">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Create App UI"
              value={taskData.title}
              className="form-input"
              onChange={({ target }) =>
                changeValueHandler("title", target.value)
              }
            />
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              Description
            </label>
            <textarea
              className="form-input resize-none"
              placeholder="Describe task"
              rows={4}
              value={taskData.description}
              onChange={({ target }) =>
                changeValueHandler("description", target.value)
              }
            ></textarea>
          </div>

          <div className="mt-2 grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-medium text-slate-600">
                Priority
              </label>
              <SelectDropdown
                options={PRIORITY_DATA}
                value={taskData.priority}
                onChange={(value) => changeValueHandler("priority", value)}
                placeholder="Select Priority"
              />
            </div>

            {/* ✅ Updated Due Date with react-datepicker */}
            <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-medium text-slate-600">
                Due Date
              </label>
              <DatePicker
                selected={taskData.dueDate ? new Date(taskData.dueDate) : null}
                onChange={(date) =>
                  changeValueHandler(
                    "dueDate",
                    date ? date.toISOString().split("T")[0] : "",
                  )
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select due date"
                className="form-input w-full"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                withPortal // ✅ ensures the popup is rendered on top of everything
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <label className="text-xs font-medium text-slate-600">
                Assign To
              </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) =>
                  changeValueHandler("assignedTo", value)
                }
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              TODO CHECKLIST
            </label>
            <TodoListInput
              todoList={taskData.todoChecklist}
              setTodoList={(value) =>
                changeValueHandler("todoChecklist", value)
              }
            />
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              Add Attachments
            </label>
            <AddAttachmentInput
              attachments={taskData.attachments}
              setAttachments={(value) =>
                changeValueHandler("attachments", value)
              }
            />
          </div>

          <div className="mt-7 flex justify-end">
            <button
              className="add-btn"
              onClick={submitHandler}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <ClipLoader color="white" size={24} />
              ) : taskId ? (
                "UPDATE TASK"
              ) : (
                "ADD TASK"
              )}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        closeHandler={() => setOpenDeleteAlert(false)}
        title="Confirm Delete"
        className="fixed inset-0 z-50 flex items-center justify-center"
        contentClassName="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <p className="mb-4 text-sm text-gray-700">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpenDeleteAlert(false)}
            className="cursor-pointer rounded border border-gray-300 px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="cursor-pointer rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? <ClipLoader color="white" size={24} /> : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default TaskFormPage;
