import React from "react";

const VoucherInformationSection = ({ name, type, category }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-sm p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Voucher Information
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm">Voucher Name</p>
          <p className="text-sm font-medium">{name}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Voucher Type</p>
          <p className="text-sm font-medium">{type}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Voucher Category</p>
          <p className="text-sm font-medium">{category}</p>
        </div>
      </div>
    </div>
  );
};

export default VoucherInformationSection;
