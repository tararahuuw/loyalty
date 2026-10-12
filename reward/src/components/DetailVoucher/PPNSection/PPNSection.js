import React from "react";
import { Description } from "sprint-asia-custom-component";

const PPNSection = ({ tax }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">PPN Information</div>

      <Description
        title={`PPN percentage amount is ${tax} %`}
        value="The PPN will be automatically calculated based on the price type you select above, and it will apply to each voucher transaction."
      />
    </div>
  );
};

export default PPNSection;
