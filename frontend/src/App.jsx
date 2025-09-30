import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import MyTasksPage from "./pages/MyTaskPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import ManageTasksPage from "./pages/admin/ManageTasksPage";
import TaskFormPage from "./pages/admin/TaskFormPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
// import GoogleCallbackPage from "./pages/GoogleCallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* <Route path="/google-callback" element={<GoogleCallbackPage />} /> */}

        {/* General Authenticated Routes */}
        <Route
          element={<ProtectedRoutes allowedRoutes={["admin", "member"]} />}
        >
          <Route element={<AppLayout />}>
            <Route path="/" element={<UserDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tasks" element={<MyTasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetailsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes allowedRoutes={["admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/tasks" element={<ManageTasksPage />} />
            <Route path="/admin/create-task" element={<TaskFormPage />} />
            <Route path="/admin/update-task" element={<TaskFormPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
