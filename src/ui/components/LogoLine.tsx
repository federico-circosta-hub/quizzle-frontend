import React from "react";
import AppVersion from "./AppVersion";

const LogoLine = () => {
  return (
    <div className="w-[200px] mx-auto relative flex items-end">
      <img
        src={require("../../imgs/logo3.png")}
        alt="quizzle logo"
        width={200}
      />
      <AppVersion />
    </div>
  );
};

export default LogoLine;
