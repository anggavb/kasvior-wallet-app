import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, userLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoggedIn?.token) {
      toast.error("You must be logged in to access this page");
      navigate("/login", { replace: true });
      return;
    }

    if (!userLoggedIn.hasPin) {
      toast.info("Please set your pin for better experience!");
      navigate("/enter-pin", { replace: true });
    }
  }, [navigate, userLoggedIn]);

  if (!userLoggedIn?.token || !userLoggedIn.hasPin) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
