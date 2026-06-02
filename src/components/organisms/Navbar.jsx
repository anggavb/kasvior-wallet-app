import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

import { LogoutIcon, DashboardIcon } from "@components/atoms/icons";
import { useLogout } from "@hooks";
import profile from "@/assets/images/Ellipse 185.png";

const Navbar = () => {
  const { user } = useSelector((state) => state.userLogin);
  const requestLogout = useLogout();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsProfileMenuOpen(false);
    requestLogout();
  };
  return (
    <header className="py-4 bg-blue-700 text-white shadow-sm sticky top-0 z-100">
      <div className="container flex items-center justify-between mx-auto max-w-300 px-5">
        <div className="flex items-center gap-2.5 text-xl font-semibold font-logo">
          <img
            src="/money-wallet.png"
            alt="wallet"
            className="h-8 drop-shadow-sm"
          />
        </div>
        <nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <div
                  className="relative flex items-center gap-3 cursor-pointer"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className="hidden text-sm font-medium text-white md:inline">
                    {user?.name || "noname"}
                  </span>
                  <img
                    src={profile}
                    alt="Profile"
                    className="hidden md:inline w-9 h-9 rounded-full object-cover"
                  />
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden md:inline"
                  >
                    <path
                      d="M13 1L7 7L1 1"
                      stroke="#4F5665"
                      strokeWidth="2"
                      className="stroke-white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <svg
                  viewBox="0 0 100 80"
                  width="40"
                  height="40"
                  className="fill-blue-600 md:hidden cursor-pointer"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <rect width="80" height="10"></rect>
                  <rect y="20" width="80" height="10"></rect>
                  <rect y="40" width="80" height="10"></rect>
                </svg>
                {isProfileMenuOpen && (
                  <div className="absolute top-full right-4 bg-white border border-[#e5e5e5] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] w-50 p-2 flex flex-col z-1000">
                    <Link
                      to="admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-colors duration-200 bg-blue-600 text-white"
                    >
                      <DashboardIcon className="w-5 h-5 stroke-white" />
                      Go to Admin
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleConfirmLogout();
                      }}
                      className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-colors duration-200 text-[#dc2626] mt-2 hover:bg-[#f9fafb]"
                    >
                      <LogoutIcon className="stroke-red-600" /> Keluar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 sm:px-6 text-sm font-medium transition-colors border border-white rounded-lg hover:bg-white/10 active:scale-95"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 sm:px-6 text-sm font-medium transition-colors bg-white rounded-lg text-blue-700 hover:bg-gray-100 active:scale-95 shadow-sm"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
