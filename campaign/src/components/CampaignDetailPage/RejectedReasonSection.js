import React from "react";
import { XCircleIcon } from "@phosphor-icons/react";

const RejectedReasonSection = ({ reason }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border border-danger500 bg-danger50">
      <div className="flex gap-2">
        <XCircleIcon className="text-danger500" size={20} weight="fill" />
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base">Campaign Rejected</p>
          <div>
            <p className="text-sm whitespace-pre-line">Your campaign was rejected due to: “{reason}”.</p>
            <p className="text-sm">Please review the feedback and update your campaign before resubmission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedReasonSection;
