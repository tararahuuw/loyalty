import React from "react";
import LogoMaintenance from "../../assets/images/maintenance.png";
import { useEffect } from "react";

const Maintenance = ({ setTitleHeader }) => {
  useEffect(() => {
    setTitleHeader("Report Analytic");
  }, []);
  return (
    <div className="w-full bg-white flex justify-center items-center" style={{ height: "78vh" }}>
      <div>
        <div className="flex justify-center mb-1">
          <img src={LogoMaintenance} className="w-32 h-32" />
        </div>
        <p className="text-xl font-semibold text-black text-center">Coming Soon</p>
        <p className="text-sm font-semibold text-neutral300 text-center">
          Sorry the page you are looking for is under construction!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
