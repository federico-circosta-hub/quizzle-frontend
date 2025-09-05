import React from "react";
import pkg from "../../../package.json";

const AppVersion = () => {
  return (
    <div
      id="app-version"
      className="absolute right-[-38px] font-extralight text-xs text-[#3b82f6] p-1 pb-3"
    >
      ver {pkg.version}
    </div>
  );
};

export default AppVersion;
