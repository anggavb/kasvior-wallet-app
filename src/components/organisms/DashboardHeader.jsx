import { useState } from "react";
import profile from "@/assets/images/Ellipse 185.png";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { LogoutIcon } from "@components/atoms/icons";
import { listMenus } from "@utils";
import { useLogout } from "@hooks";

/**
 * DashboardHeader component that renders the header for the dashboard layout.
 * @returns {JSX.Element}
 */

function DashboardHeader() {
  const navigate = useNavigate();
  const { user: userLoggedIn } = useSelector((state) => state.userLogin);
  const requestLogout = useLogout();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConfirmLogout = () => {
    requestLogout();
  };

  return (
    <header className="sticky top-0 z-100 flex items-center justify-between h-14 px-3 py-2 bg-white border-b border-gray-200 sm:h-16 sm:px-4 sm:py-3 md:h-17.5 md:px-8 md:py-4">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center gap-2.5 text-xl font-semibold text-blue-600 font-logo"
      >
        <img src="/money-wallet-black.png" alt="wallet" width="100" />
      </div>
      <div
        className="relative flex items-center gap-3 cursor-pointer"
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
      >
        <span className="hidden text-sm font-medium text-gray-500 md:inline">
          {userLoggedIn?.name || "noname"}
        </span>
        <img
          src={
            userLoggedIn && userLoggedIn.avatar ? userLoggedIn.avatar : profile
          }
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
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <rect width="80" height="10"></rect>
        <rect y="20" width="80" height="10"></rect>
        <rect y="40" width="80" height="10"></rect>
      </svg>

      {isProfileMenuOpen && (
        <div className="absolute top-full right-4 bg-white border border-[#e5e5e5] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] w-50 p-2 flex flex-col z-1000">
          <Link
            to="profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-colors duration-200 bg-blue-600 text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.7496 7.49997C15.7496 8.49453 15.3545 9.44835 14.6513 10.1516C13.948 10.8549 12.9942 11.25 11.9996 11.25C11.005 11.25 10.0512 10.8549 9.34797 10.1516C8.64469 9.44835 8.24961 8.49453 8.24961 7.49997C8.24961 6.50541 8.64469 5.55158 9.34797 4.84832C10.0512 4.14506 11.005 3.74997 11.9996 3.74997C12.9942 3.74997 13.948 4.14506 14.6513 4.84832C15.3545 5.55158 15.7496 6.50541 15.7496 7.49997ZM15.8411 12.1095C16.7881 11.3199 17.4688 10.2578 17.7908 9.06768C18.1127 7.87751 18.0601 6.61707 17.6402 5.45784C17.2204 4.29861 16.4536 3.29687 15.4442 2.58888C14.4348 1.88091 13.2318 1.5011 11.9989 1.5011C10.7659 1.5011 9.56293 1.88091 8.55354 2.58888C7.54414 3.29687 6.77734 4.29861 6.35749 5.45784C5.93763 6.61707 5.88507 7.87751 6.20698 9.06768C6.5289 10.2578 7.20964 11.3199 8.15661 12.1095C6.67999 12.8076 5.42101 13.8941 4.51446 15.2527C3.6079 16.6114 3.0879 18.1909 3.01011 19.8225C3.00288 20.1165 3.11103 20.4016 3.31143 20.6167C3.51181 20.832 3.7885 20.9602 4.08226 20.9739C4.37601 20.9877 4.66345 20.8858 4.88304 20.6902C5.10262 20.4946 5.2369 20.2209 5.25711 19.9275C5.33889 18.1942 6.08496 16.5591 7.34047 15.3615C8.59597 14.1638 10.2645 13.4956 11.9996 13.4956C13.7347 13.4956 15.4033 14.1638 16.6588 15.3615C17.9143 16.5591 18.6604 18.1942 18.7421 19.9275C18.7459 20.0773 18.7793 20.2248 18.8408 20.3614C18.9023 20.4981 18.9905 20.6211 19.1002 20.7231C19.2098 20.8252 19.3388 20.9044 19.4794 20.956C19.6201 21.0076 19.7696 21.0306 19.9193 21.0235C20.069 21.0166 20.2157 20.9797 20.351 20.9152C20.4862 20.8507 20.6072 20.76 20.7068 20.6481C20.8066 20.5362 20.8828 20.4055 20.9312 20.2638C20.9798 20.122 20.9995 19.9719 20.9891 19.8225C20.9111 18.1908 20.3909 16.6111 19.4842 15.2524C18.5773 13.8938 17.318 12.8074 15.8411 12.1095Z"
                fill="white"
              />
            </svg>{" "}
            Profile
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsProfileMenuOpen(false);
              handleConfirmLogout();
            }}
            className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-colors duration-200 text-[#dc2626] mt-2 hover:bg-[#f9fafb]"
          >
            <LogoutIcon className="stroke-red-600" /> Keluar
          </button>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 bg-white border border-[#e5e5e5] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] w-50 p-2 flex flex-col z-1000">
          {listMenus.map((menu) => (
            <Link
              key={menu.name}
              to={menu.to}
              onClick={
                menu.name === "Logout"
                  ? (e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      handleConfirmLogout();
                    }
                  : menu.onclick
              }
              className={menu.class}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;
