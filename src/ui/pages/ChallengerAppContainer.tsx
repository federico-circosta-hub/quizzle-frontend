import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useChallengerExistsQuery } from "../../redux/api";
import { CircularProgress } from "@mui/material";
import ErrorPage from "../components/ErrorPage";
import AdminPassphraseModal from "../modal/AdminPassphraseModal";
import LogoLine from "../components/LogoLine";

type RoutesType = {
  0: string;
  1: string;
};

const ChallengerAppContainer = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [routes, setRoutes] = useState<RoutesType>();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { name, id } = useParams();

  const { data: challengerExists, isLoading } = useChallengerExistsQuery({
    name,
    id,
  });

  useEffect(() => {
    const auth = localStorage.getItem("isChallengerAuthorized") === "true";
    const expiration = localStorage.getItem("authChallengerExpiration");
    const adminUsername = localStorage.getItem("adminUsername");
    if (
      !auth ||
      !expiration ||
      !adminUsername ||
      Date.now() > Number(expiration)
    ) {
      localStorage.removeItem("isChallengerAuthorized");
      localStorage.removeItem("authChallengerExpiration");
      localStorage.removeItem("adminUsername");
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    setRoutes({
      0: `/challenger/${name}/${id}/scores`,
      1: `/challenger/${name}/${id}/questions`,
    });
  }, [name, id]);

  useEffect(() => {
    if (routes) navigate(routes[value]);
  }, [routes, value, navigate]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <LogoLine />
      {isLoading ? (
        <CircularProgress />
      ) : !challengerExists ? (
        <ErrorPage />
      ) : isAuthorized ? (
        <>
          <Outlet />
          <BottomNav
            value={value}
            handleChange={handleChange}
            isAdmin={false}
          />
        </>
      ) : (
        <AdminPassphraseModal onSuccess={() => setIsAuthorized(true)} />
      )}
    </>
  );
};

export default ChallengerAppContainer;
