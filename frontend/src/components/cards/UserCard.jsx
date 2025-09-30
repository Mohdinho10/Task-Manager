import { useState } from "react";
import { useSelector } from "react-redux";
import { getInitials } from "../../utils/helper";
import { BASE_URL } from "../../constants";
import StatsCard from "./StatsCard";
import UserModal from "../UserModal";

function UserCard({ userInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo: currentUser } = useSelector((state) => state.auth); // 👈 logged-in user

  const hasImage =
    userInfo?.profileImageUrl && userInfo?.profileImageUrl !== "";

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="user-card cursor-pointer rounded border p-2 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasImage ? (
              <img
                src={`${BASE_URL}${userInfo?.profileImageUrl?.replace("public", "")}`}
                alt={userInfo?.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-700">
                {getInitials(userInfo?.name)}
              </div>
            )}
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

      {/* Modal */}
      {isOpen && (
        <UserModal
          user={userInfo}
          currentUser={currentUser} // 👈 pass logged-in user
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default UserCard;
