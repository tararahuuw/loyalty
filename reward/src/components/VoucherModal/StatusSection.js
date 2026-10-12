import React from "react";

const StatusSection = ({ status = "active" }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-sm p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Status</div>

      <p
        className={`${
          status === "active" ? "text-success500" : status === "failed" ? "text-danger500" : "text-neutral300"
        } font-bold`}
      >
        Voucher is {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </div>
  );
};

export default StatusSection;
