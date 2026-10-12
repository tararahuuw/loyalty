import React from "react";

import { Switch } from "sprint-asia-custom-component";

const SwitchStatus = ({ handleToggle, isChecked }) => {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Status</div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-between w-full">
          <p className="text-black font-semibold text-base">Activate Your User</p>

          <Switch onChange={handleToggle} checked={isChecked} isEdit />
        </div>

        <p className="text-neutral500 font-normal text-sm">
          However, when you switch off the toggle, your user enters an inactive and All transactions are paused.
        </p>
      </div>
    </div>
  );
};

export default SwitchStatus;
