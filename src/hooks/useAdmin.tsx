import { useSelector } from "react-redux";
import { stateType } from "../redux/adminSlice";

const useAdmin = () => {
  const isAdminRoutes: boolean = !!window.location.pathname.includes("admin");
  const { jwt, username } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );
  const adminUserName = localStorage.getItem("adminUsername");
  return isAdminRoutes
    ? { jwt: jwt, username: username }
    : { jwt: "", username: adminUserName || "" };
};

export default useAdmin;
