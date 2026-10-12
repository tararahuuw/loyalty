import React from "react";

const StatusSection = ({ status }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral40 pl-6 pr-6">
      <div className="flex justify-between">
        <div className="pt-6 pb-2">
          <p className="text-lg font-semibold leading-6 text-left">Status</p>
        </div>
      </div>
      <hr className="w-full text-neutral40" />
      <div className="pt-4 pb-4 pr-4">
        <div className="grid grid-cols-3 gap-3">
          <p className={`${status === "Active" ? "text-success500" : "text-danger500"} font-semibold text-base`}>
            Division is {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusSection;
