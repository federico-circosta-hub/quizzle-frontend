import React from "react";
import pkg from "../../../package.json";

const AppVersion = () => {
  return (
    <div
      id="app-version"
      className="absolute right-0 font-thin text-xs text-[#3b82f6] p-1 pb-3 pr-2"
    >
      ver: {pkg.version}
    </div>
  );
};

export default AppVersion;
