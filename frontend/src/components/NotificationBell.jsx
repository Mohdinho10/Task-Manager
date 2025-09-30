import { useState } from "react";
import { FiBell } from "react-icons/fi";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "../slices/notificationApiSlice";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  if (isLoading) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification:", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-96 w-72 overflow-y-auto rounded-lg border bg-white shadow-lg">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkAsRead(n._id)}
                className={`text-primary cursor-pointer border-b p-3 last:border-none hover:bg-gray-50 ${
                  n.read ? "text-gray-500" : ""
                }`}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
