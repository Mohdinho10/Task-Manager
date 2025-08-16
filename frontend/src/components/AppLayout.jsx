import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { Outlet } from "react-router-dom";

function AppLayout() {
  const user = useSelector((state) => state.auth.userInfo);

  return (
    <div className="">
      <Navbar />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu />
          </div>
          <div className="mx-5 grow">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
