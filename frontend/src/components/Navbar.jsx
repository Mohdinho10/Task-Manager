import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import NotificationBell from "./NotificationBell"; // ✅ import the bell

function Navbar() {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 backdrop-blur-[2px]">
        {/* Logo / Brand */}
        <h2 className="text-primary text-xl font-semibold">Task Manager</h2>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* ✅ Notification Bell */}
          <NotificationBell />

          {/* Toggle Menu Button (Mobile) */}
          {!openSideMenu ? (
            <button
              className="text-primary cursor-pointer lg:hidden"
              onClick={() => setOpenSideMenu(true)}
            >
              <HiOutlineMenu className="text-3xl" />
            </button>
          ) : (
            <button
              className="text-primary cursor-pointer lg:hidden"
              onClick={() => setOpenSideMenu(false)}
            >
              <HiOutlineX className="text-2xl" />
            </button>
          )}
        </div>
      </nav>

      {/* Drawer Menu */}
      {openSideMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenSideMenu(false)}
          />

          {/* Slide-in SideMenu */}
          <div className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out">
            {/* SideMenu Content */}
            <SideMenu
              setOpenSideMenu={setOpenSideMenu}
              openSideMenu={openSideMenu}
            />
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
