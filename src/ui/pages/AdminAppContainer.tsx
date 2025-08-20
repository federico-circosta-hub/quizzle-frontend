import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import LogoLine from "../components/LogoLine";

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
      <LogoLine />
      <Outlet />
      <div className="flex-1">
        <BottomNav value={value} handleChange={handleChange} isAdmin={true} />
      </div>
    </>
  );
};

export default AdminAppContainer;
