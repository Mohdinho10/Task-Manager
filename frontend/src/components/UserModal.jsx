import { useRef, useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../slices/userApiSlice";
import { BASE_URL } from "../constants";
import StatsCard from "./cards/StatsCard";
import { IoMdClose } from "react-icons/io";

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  "on leave": "bg-yellow-500",
};

function UserModal({ user, onClose, currentUser }) {
  const overlayRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // ✅ Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!user) return null;

  const hasImage = user?.profileImageUrl && user?.profileImageUrl !== "";

  // ✅ Close on click outside
  const handleClickOutside = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.data?.message || "Failed to delete user");
    }
  };

  // ✅ Toggle role (promote/demote admin)
  const handleToggleRole = async () => {
    try {
      const newRole = user.role === "admin" ? "member" : "admin";
      await updateUser({ id: user._id, role: newRole }).unwrap();
      onClose();
    } catch (err) {
      console.error("Role update failed:", err);
      alert(err?.data?.message || "Failed to update role");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="h-6 w-6 cursor-pointer" />
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="mt-4 flex items-center gap-4">
          {hasImage ? (
            <img
              src={`${BASE_URL}${user?.profileImageUrl?.replace("public", "")}`}
              alt={user?.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-lg font-bold text-gray-700">
              {user?.name?.charAt(0)}
            </div>
          )}

          <div>
            <p className="text-base font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>

            {/* ✅ Phone number */}
            {user?.phone && (
              <p className="text-sm text-gray-500">📞 {user.phone}</p>
            )}

            {/* Availability */}
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  statusColors[user?.availability] || "bg-gray-400"
                }`}
              ></span>
              <span className="text-xs text-gray-600 capitalize">
                {user?.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-medium">Role:</span>{" "}
            <span className="capitalize">{user?.role}</span>
          </p>
        </div>

        {/* ✅ Task Summary using StatsCard */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatsCard
            label="Pending"
            count={user?.pendingTasks || 0}
            status="pending"
          />
          <StatsCard
            label="In Progress"
            count={user?.inProgressTasks || 0}
            status="inProgress"
          />
          <StatsCard
            label="Completed"
            count={user?.completedTasks || 0}
            status="completed"
          />
        </div>

        {/* Admin Actions */}
        {currentUser?.role === "admin" && currentUser?._id !== user._id && (
          <div className="mt-6 flex justify-between">
            {user.role !== "admin" && (
              <button
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Delete User
              </button>
            )}

            <button
              onClick={handleToggleRole}
              className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              {user.role === "admin" ? "Demote to Member" : "Promote to Admin"}
            </button>
          </div>
        )}

        {/* ✅ Custom Confirmation Popup */}
        {showConfirm && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
            <div className="w-80 rounded-lg bg-white p-6 text-center shadow-lg">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-medium">{user?.name}</span>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserModal;
