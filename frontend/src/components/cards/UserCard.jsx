import { BASE_URL } from "../../constants";
import StatsCard from "./StatsCard";

function UserCard({ userInfo }) {
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`${BASE_URL}${userInfo.profileImageUrl.replace("public", "")}`}
            alt={userInfo.name}
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-end gap-3">
        <StatsCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="pending"
        />
        <StatsCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="inProgress"
        />
        <StatsCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="completed"
        />
      </div>
    </div>
  );
}

export default UserCard;
