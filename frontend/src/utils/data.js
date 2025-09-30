import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuUser,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: 1,
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: 2,
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: 3,
    label: "Create Task",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: 4,
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: 5,
    label: "Calendar",
    icon: LuClipboardCheck,
    path: "/calendar",
  },
  {
    id: 6,
    label: "Profile",
    icon: LuUser,
    path: "/profile",
  },
  {
    id: 7,
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: 1,
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/",
  },
  {
    id: 2,
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/tasks",
  },
  {
    id: 3,
    label: "Calendar",
    icon: LuClipboardCheck,
    path: "/calendar",
  },
  {
    id: 4,
    label: "Profile",
    icon: LuUser,
    path: "/profile",
  },
  {
    id: 5,
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const STATUS_DATA = [
  { label: "pending", value: "pending" },
  { label: "in-progress", value: "in-progress" },
  { label: "completed", value: "completed" },
];
