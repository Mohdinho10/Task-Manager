import { useEffect, useState } from "react";
import { useGetUsersQuery } from "../slices/userApiSlice";
import { LuUsers } from "react-icons/lu";
import { BASE_URL } from "../constants";
import { getInitials } from "../utils/helper";
import Loader from "./Loader";
import Modal from "./Modal";
import AvatarGroup from "./AvatarGroup";

function SelectUsers({ selectedUsers, setSelectedUsers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const {
    data: users,
    isLoading,
    isError,
    error,
    // refetch,
  } = useGetUsersQuery();

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const assignHandler = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = users
    ?.filter((user) => (selectedUsers || []).includes(user._id))
    .map((user) => ({
      name: user.name,
      profileImageUrl: user.profileImageUrl,
    }));

  console.log(selectedUserAvatars);

  useEffect(() => {
    if (selectedUsers?.length === 0) {
      setTempSelectedUsers([]);
    }

    return () => {};
  }, [selectedUsers]);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p>Error loading dashboard: {error?.data?.message || error.message}</p>
    );

  return (
    <div className="mt-2 space-y-4">
      {selectedUserAvatars?.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}
      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        closeHandler={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="h-[60vh] space-y-4 overflow-y-auto">
          {users?.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 border-b border-gray-200 p-3"
            >
              {user?.profileImageUrl ? (
                <img
                  src={`${BASE_URL}${user.profileImageUrl.replace("public", "")}`}
                  className="h-10 w-10 rounded-full object-cover"
                  alt={user?.name}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}{" "}
                </p>
                <p className="text-[13px] text-gray-500">{user.email} </p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="text-primary h-4 w-4 cursor-pointer rounded-sm border-gray-300 bg-gray-100 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={assignHandler}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SelectUsers;
