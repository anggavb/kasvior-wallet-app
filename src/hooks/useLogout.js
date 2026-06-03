import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { logoutUser } from "@redux/slices/userLogin";
import useLogoutStore from "@zustand/store";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

      await dispatch(logoutUser());
      navigate("/", { replace: true });
      toast.info("Come back soon!");
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
  ]);

  return requestLogout;
};

export default useLogout;
