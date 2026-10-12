import React, { useState } from "react";

import { CaretDown } from "@phosphor-icons/react";
import { TextInput } from "sprint-asia-custom-component";

const RedeemButton = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`rounded-md bg-primary50 w-full flex flex-col gap-2 px-3 py-4`}>
      <div className="flex flex-row justify-between items-center mt-1">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm font-medium">Button · Redeem Now</p>
        </div>

        <a className="cursor-pointer" onClick={toggleCollapse}>
          <CaretDown
            size={18}
            style={{
              transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s",
            }}
          />
        </a>
      </div>

      <div
        className={`bg-white rounded-md w-full overflow-hidden transition-[max-height] duration-300 ${
          isCollapsed ? "max-h-0" : "max-h-80"
        }`}
      >
        <div className="p-4">
          <TextInput title="Label" placeholder="Input label" value="Redeem Now" mode="disable" />
        </div>
      </div>
    </div>
  );
};

export default RedeemButton;
