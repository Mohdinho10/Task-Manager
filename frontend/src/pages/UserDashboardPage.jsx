import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdCard } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import { addThousandSeparator } from "../utils/helper";
import moment from "moment";
import Loader from "../components/Loader";
import InfoCard from "../components/cards/InfoCard";
import TaskListTable from "../components/TaskListTable";
import CustomPieChart from "../components/charts/CustomPieChart";
import CustomBarChart from "../components/charts/CustomBarChart";
import { useGetUserDashboardDataQuery } from "../slices/taskApiSlice";

function UserDashboardPage() {
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const COLORS = ["#8d51ff", "#00B8DB", "#7bce00"];
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useGetUserDashboardDataQuery();

  const prepareChartData = (data) => {
    const { taskDistribution = {}, taskPriorityLevels = {} } = data || {};

    const statusMap = {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
    };

    setPieChartData([
      { status: statusMap["pending"], count: taskDistribution?.pending || 0 },
      {
        status: statusMap["inProgress"],
        count: taskDistribution?.inProgress || 0,
      },
      {
        status: statusMap["completed"],
        count: taskDistribution?.completed || 0,
      },
    ]);

    setBarChartData([
      { status: "low", count: taskPriorityLevels?.low || 0 },
      { status: "medium", count: taskPriorityLevels?.medium || 0 },
      { status: "high", count: taskPriorityLevels?.high || 0 },
    ]);
  };

  useEffect(() => {
    if (dashboardData?.charts) {
      prepareChartData(dashboardData.charts);
    }
  }, [dashboardData]);

  const onSeeMore = () => navigate("/tasks");

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <p className="text-red-500">
        Error: {error?.data?.message || error.message}
      </p>
    );
  }

  return (
    <>
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Welcome back, {user?.name}!</h2>
            <p className="mt-1.5 text-xs text-gray-400 md:text-[13px]">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0,
            )}
            color="bg-primary"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.pending || 0,
            )}
            color="bg-violet-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="In Progress"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.inProgress || 0,
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.completed || 0,
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 gap-6 md:my-6 md:grid-cols-2">
        <div className="card">
          <h5 className="font-medium">Task Status</h5>
          <CustomPieChart data={pieChartData} label="Tasks" colors={COLORS} />
        </div>

        <div className="card">
          <h5 className="font-medium">Task Priority</h5>
          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData.recentTasks || {}} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;
