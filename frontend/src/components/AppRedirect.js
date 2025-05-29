import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppRedirect = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login or landing page
    } else if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "approver") {
      navigate("/approvals");
    } else if (user.role === "requester") {
      navigate("/my-requests");
    } else {
      navigate("/"); // fallback route
    }
  }, [navigate, user]);

  return null;
};

export default AppRedirect;
