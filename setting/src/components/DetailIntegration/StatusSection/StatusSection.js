import React from "react";

const StatusSection = ({ status }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Integration Management
      </div>

      <p className={`${status === "Active" ? "text-success500" : "text-danger500"} font-semibold text-base`}>
        Integration is {status}
      </p>
    </div>
  );
};

export default StatusSection;
