import { useParams } from "react-router-dom";
import {
  useGetTaskQuery,
  useUpdateTaskChecklistMutation,
} from "../slices/taskApiSlice";
import Loader from "../components/Loader";
import moment from "moment";
import AvatarGroup from "../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import toast from "react-hot-toast";

function TaskDetailsPage() {
  const { id } = useParams();

  const { data: task, isLoading, refetch } = useGetTaskQuery(id);
  const [updateChecklist] = useUpdateTaskChecklistMutation();

  const handleCheckboxChange = async (index) => {
    if (!task?.todoChecklist) return;

    const optimisticChecklist = task.todoChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item,
    );

    try {
      await updateChecklist({
        id,
        todoChecklist: optimisticChecklist,
      }).unwrap();
      toast.success("Checklist updated!");
      refetch();
    } catch (err) {
      toast.error("Failed to update checklist");
      console.error("Checklist update error:", err);
    }
  };

  const calculateProgress = () => {
    const list = task?.todoChecklist || [];
    const total = list.length;
    const completed = list.filter((item) => item.completed).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case "inProgress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const displayStatusMap = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
  };

  const clickHandler = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }
    window.open(link, "_blank");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-5">
      {task && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium md:text-xl">{task.title}</h2>
              <div
                className={`text-[11px] font-medium capitalize md:text-[13px] ${getStatusTagColor(
                  task.status,
                )} rounded px-4 py-0.5`}
              >
                {displayStatusMap[task.status]}
              </div>
            </div>

            <div className="mt-4">
              <InfoBox label="Description" value={task.description} />
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4">
              <div className="col-span-6 md:col-span-4">
                <InfoBox label="Priority" value={task.priority} />
              </div>
              <div className="col-span-6 md:col-span-4">
                <InfoBox
                  label="Due Date"
                  value={
                    task.dueDate
                      ? moment(task.dueDate).format("Do MMM YYYY")
                      : "N/A"
                  }
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-500">
                  Assigned To
                </label>
                <AvatarGroup avatars={task.assignedTo} />
              </div>
            </div>

            {/* Todo Checklist */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-500">
                Todo Checklist
              </label>
              {task.todoChecklist?.map((item, index) => (
                <TodoChecklist
                  key={`todo_${index}`}
                  text={item.text}
                  isChecked={item.completed}
                  changeHandler={() => handleCheckboxChange(index)}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-500">
                Progress
              </label>
              <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {calculateProgress()}%
              </p>
            </div>

            {/* Attachments */}
            <label className="text-xs font-medium text-slate-500">
              Attachments
            </label>
            {task.attachments?.map((link, index) => (
              <Attachment
                key={`link_${index}`}
                link={link}
                index={index}
                onClick={() => clickHandler(link)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetailsPage;

// Reusable UI Components
function InfoBox({ value, label }) {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="mt-0.5 text-[12px] font-medium text-gray-700 md:text-[13px]">
        {value}
      </p>
    </>
  );
}

function TodoChecklist({ isChecked, changeHandler, text }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={changeHandler}
        className="text-primary h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-gray-100 outline-none"
      />
      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
}

function Attachment({ index, onClick, link }) {
  return (
    <div
      className="mt-2 mb-3 flex cursor-pointer justify-between rounded-md border-gray-100 bg-gray-200 px-3 py-2"
      onClick={onClick}
    >
      <div className="flex flex-1 items-center gap-3">
        <span className="mr-2 text-xs font-semibold text-gray-400">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs text-black">{link}</p>
      </div>
      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  );
}
