import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { userLoginAction } from "@redux/slices/userLogin";
import useLogoutStore from "@zustand/store";
import { api } from "@utils";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userLogin);
  const {
    modalLogout,
    toggleModalLogout,
    changeTitle,
    changeMessages,
    setHandleConfirm,
  } = useLogoutStore((state) => state);

  const requestLogout = useCallback(() => {
    changeTitle("Confirm Logout");
    changeMessages("Are you sure you want to logout?");
    setHandleConfirm(async () => {
      toggleModalLogout();

      try {
        if (user?.token) {
          await api.delete("/auth/logout", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
        }
      } catch {
        // Backend logout failure should not keep the user trapped locally.
      } finally {
        dispatch(userLoginAction.logout());
        navigate("/", { replace: true });
        toast.info("Come back soon!");
      }
    });

    if (!modalLogout) {
      toggleModalLogout();
    }
  }, [
    changeMessages,
    changeTitle,
    dispatch,
    modalLogout,
    navigate,
    setHandleConfirm,
    toggleModalLogout,
    user?.token,
  ]);

  return requestLogout;
};

export default useLogout;
