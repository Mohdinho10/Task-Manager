import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetDashboardDataQuery } from "../../slices/taskApiSlice";
import { IoMdCard } from "react-icons/io";
import { addThousandSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import Loader from "../../components/Loader";
import moment from "moment";
import InfoCard from "../../components/cards/InfoCard";
import CustomPieChart from "../../components/charts/CustomPieChart";
import TaskListTable from "../../components/TaskListTable";
import CustomBarChart from "../../components/charts/CustomBarChart";

function DashboardPage() {
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
    // refetch,
  } = useGetDashboardDataQuery();

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const statusMap = {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
    };

    const taskDistributionData = [
      { status: statusMap["pending"], count: taskDistribution?.pending || 0 },
      {
        status: statusMap["inProgress"],
        count: taskDistribution?.inProgress || 0,
      },
      {
        status: statusMap["completed"],
        count: taskDistribution?.completed || 0,
      },
    ];

    setPieChartData(taskDistributionData);
    const priorityLevelData = [
      { status: "low", count: taskPriorityLevels?.low || 0 },
      { status: "medium", count: taskPriorityLevels?.medium || 0 },
      { status: "high", count: taskPriorityLevels?.high || 0 },
    ];
    setBarChartData(priorityLevelData);
  };

  console.log(dashboardData);

  useEffect(() => {
    if (dashboardData?.charts) {
      prepareChartData(dashboardData.charts);
    }
  }, [dashboardData]);

  const onSeeMore = () => navigate("/admin/tasks");

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p>Error loading dashboard: {error?.data?.message || error.message}</p>
    );

  return (
    <>
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name} </h2>
            <p className="mt-1.5 text-xs text-gray-400 md:text-[13px]">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <InfoCard
            icon={<IoMdCard className="text-white" />}
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0,
            )}
            color="bg-indigo-500"
          />
          <InfoCard
            icon={<IoMdCard className="text-white" />}
            label="Pending"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.pending || 0,
            )}
            color="bg-amber-400"
          />
          <InfoCard
            icon={<IoMdCard className="text-white" />}
            label="In Progress"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.inProgress || 0,
            )}
            color="bg-sky-500"
          />
          <InfoCard
            icon={<IoMdCard className="text-white" />}
            label="Completed"
            value={addThousandSeparator(
              dashboardData?.charts?.taskDistribution?.completed || 0,
            )}
            color="bg-emerald-500"
          />
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 gap-6 md:my-6 md:grid-cols-2">
        {/* Custom Pie Chart */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart
              data={pieChartData}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>
        {/* Custom Bar Chart */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />{" "}
              </button>
            </div>
            <TaskListTable tableData={dashboardData.recentTasks || {}} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
