import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../slices/authSlice";
import { useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../utils/data";
import { BASE_URL } from "../constants";
import CharAvatar from "../components/CharAvatar";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";

function SideMenu({ setOpenSideMenu, openSideMenu }) {
  const [sideMenuData, setSideMenuData] = useState([]);
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Logout failed.");
    }
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA,
      );
    }
  }, [user]);

  return (
    <div className="sticky top-[61px] z-20 flex h-[calc(100vh-61px)] w-64 flex-col border-r border-gray-200/50 bg-white">
      {/* Profile section (fixed) */}
      <div className="mb-7 flex flex-col items-center justify-center pt-5">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={`${BASE_URL}${user?.profileImageUrl.replace("public", "")}`}
              alt="Profile Image"
              className="h-20 w-20 rounded-full bg-slate-400"
            />
          ) : (
            <CharAvatar
              username={user?.name}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
        </div>
        {user?.role === "admin" && (
          <div className="bg-primary mt-1 rounded-full px-3 py-0.5 text-[10px] font-medium text-white">
            Admin
          </div>
        )}
        <h5 className="mt-3 leading-6 font-medium text-gray-950">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email}</p>
      </div>

      {/* Scrollable menu section */}
      <div className="hide-scrollbar flex-1 overflow-y-auto px-1">
        {sideMenuData
          .filter((item) => item.label !== "Logout")
          .map((item) => {
            const isActive =
              currentPath === item.path ||
              currentPath.startsWith(item.path + "/");

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`mb-3 flex w-full items-center gap-4 text-[15px] ${
                  isActive
                    ? "border-primary text-primary border-r-4 bg-gradient-to-r from-blue-50/40 to-blue-100/50"
                    : "text-gray-700"
                } cursor-pointer px-6 py-3 transition duration-150 hover:bg-blue-50`}
                onClick={() => {
                  if (setOpenSideMenu && openSideMenu) {
                    setOpenSideMenu(false);
                  }
                }}
              >
                <item.icon className="text-xl" />
                {item.label}
              </Link>
            );
          })}
      </div>

      {/* Logout button (fixed at bottom) */}
      <button
        onClick={logoutHandler}
        className="flex w-full cursor-pointer items-center gap-4 px-6 py-3 text-[15px] text-red-500 transition duration-150 hover:bg-red-50"
      >
        <LuLogOut className="text-xl" />
        Logout
      </button>
    </div>
  );
}

export default SideMenu;
