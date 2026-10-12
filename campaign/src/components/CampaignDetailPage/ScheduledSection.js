import React from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";

const ScheduledSection = () => {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border border-success500 bg-success50">
      <div className="flex gap-2">
        <CheckCircleIcon className="text-success500" size={20} weight="fill" />
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base">Campaign Approved</p>
          <p className="text-sm">Your campaign has been successfully approved and will proceed as scheduled</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduledSection;
