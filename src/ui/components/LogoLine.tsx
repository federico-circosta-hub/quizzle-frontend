import React from "react";
import AppVersion from "./AppVersion";

const LogoLine = () => {
  return (
    <div className="w-11/12 flex relative items-end">
      <img
        className="mx-auto"
        src={require("../../imgs/logo3.png")}
        alt="quizzle logo"
        width={200}
      />
      <AppVersion />
    </div>
  );
};

export default LogoLine;
