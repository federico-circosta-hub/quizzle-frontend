import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const routes = {
  0: "/admin/dashboard/scores",
  1: "/admin/dashboard/questions",
  2: "/admin/dashboard/challengers",
};

const AdminAppContainer = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    navigate(routes[newValue]);
  };
  return (
    <>
      <img
        src={require("../../imgs/logo.png")}
        alt="quizzle logo"
        width={200}
      />
      <Outlet />
      <BottomNav value={value} handleChange={handleChange} isAdmin={true} />
    </>
  );
};

export default AdminAppContainer;
