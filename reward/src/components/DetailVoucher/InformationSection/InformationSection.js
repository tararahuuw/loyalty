import React from "react";
import { Description } from "sprint-asia-custom-component";

const InformationSection = ({ name, type, category }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Voucher Information
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <Description title="Voucher Name" value={name} />
        </div>
        <div className="flex-1">
          <Description title="Voucher Type" value={type} />
        </div>
        <div className="flex-1">
          <Description title="Voucher Category" value={category} />
        </div>
      </div>
    </div>
  );
};

export default InformationSection;
