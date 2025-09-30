export const BASE_URL =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://expense-tracker-jytz.onrender.com";

export const REPORT_URL = "/api/reports";
export const TASKS_URL = "/api/tasks";
export const USERS_URL = "/api/users";
export const NOTIFICATION_URL = "/api/notifications";
