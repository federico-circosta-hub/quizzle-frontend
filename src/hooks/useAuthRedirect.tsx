import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetAdminStuff } from "../redux/adminSlice";
import { stateType } from "../redux/adminSlice";

const useAuthRedirect = () => {
  const exp = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle?.exp
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");

  const [firstCheck, setFirstCheck] = useState(true);

  useEffect(() => {
    if (!firstCheck) return;
    if (!isAdminPath) return;
    if (!exp) {
      navigate("/admin/login");
      return;
    }

    try {
      const currentTime = Date.now() / 1000;
      if (exp < currentTime) {
        dispatch(resetAdminStuff());
        navigate("/admin/login");
        return;
      }
      navigate("/admin/dashboard/scores");
      setFirstCheck(false);
    } catch (error) {
      console.error("Errore nella decodifica del token:", error);
      dispatch(resetAdminStuff());
      navigate("/admin/login");
    }
  }, [exp, dispatch, navigate, isAdminPath, firstCheck]);
};

export default useAuthRedirect;
