import React from "react";
import { Description } from "sprint-asia-custom-component";

const BasicInformationSection = ({ paymentID, paymentName, status }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <p className={`${status === "Active" ? "text-success500" :
        status === "Inactive" ? "text-neutral300" :
          status === "Scheduled" ? "text-primary500" :
            status === "Draft" ? "text-warning800" : "text-black"
        } font-semibold text-md`}
      >Payment Method {status ? status : ""}</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-5">
          <Description title="Payment ID" value={paymentID} />
        </div>
        <div className="flex flex-col gap-5">
          <Description title="Payment Name" value={paymentName} />
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
