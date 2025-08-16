import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/cards/UserCard";
import Loader from "../../components/Loader";
import { useGetTasksQuery } from "../../slices/taskApiSlice";
import { useGetUsersQuery } from "../../slices/userApiSlice";
import { useLazyExportUsersReportQuery } from "../../slices/reportSlice";

const ManageUsersPage = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();
  const [triggerDownload] = useLazyExportUsersReportQuery();

  const reportDownloadHandler = async () => {
    try {
      const response = await triggerDownload().unwrap();

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users-report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download report", error);
    }
  };

  if (usersLoading || tasksLoading) return <Loader />;

  return (
    <div className="mt-5 mb-10">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-xl font-medium">Team Members</h2>
        <button
          className="download-btn flex items-center gap-2 rounded border bg-white px-4 py-2 text-sm shadow hover:bg-gray-100"
          onClick={reportDownloadHandler}
        >
          <LuFileSpreadsheet className="text-lg" />
          Download Report
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <UserCard key={user._id} userInfo={user} />
        ))}
      </div>
    </div>
  );
};

export default ManageUsersPage;
