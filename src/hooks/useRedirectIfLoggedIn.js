import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const useRedirectIfLoggedIn = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (!user?.token) {
      return;
    }

    navigate(user.hasPin ? "/admin" : "/enter-pin", { replace: true });
  }, [user, navigate]);
};

export default useRedirectIfLoggedIn;
