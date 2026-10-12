import React from "react";
import { Switch } from "sprint-asia-custom-component";

const StatusSection = ({ handleToggle, isChecked, itemName }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Status</div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center w-full">
          <p className="text-black font-semibold text-base mr-2">Activate Your {itemName}</p>

          <Switch onChange={handleToggle} checked={isChecked} isEdit />
        </div>

        <p className="text-neutral500 font-normal text-sm">
          when you disable the toggle, your product will be inactive and cannot be used as a parameter in the campaign.
        </p>
      </div>
    </div>
  );
};

export default StatusSection;
