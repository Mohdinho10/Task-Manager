import { useGetTasksQuery } from "../slices/taskApiSlice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from "react-hot-toast";

function CalendarPage() {
  // ✅ pass proper params (limit: 100 to avoid pagination issues)
  const { data, isLoading, error } = useGetTasksQuery({ limit: 100 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  // ✅ extract tasks array
  const taskList = data?.tasks || [];

  // Map tasks into calendar events
  const events = taskList.map((task) => ({
    id: task._id,
    title: task.title,
    start: task.dueDate, // make sure your task model has dueDate
    backgroundColor:
      task.status === "completed"
        ? "green"
        : task.status === "in-progress"
          ? "orange"
          : "red",
  }));

  const handleEventClick = (info) => {
    toast.success(`Task: ${info.event.title}`);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">📅 Task Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="80vh"
      />
    </div>
  );
}

export default CalendarPage;
