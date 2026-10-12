import React from "react";
import { Description } from "sprint-asia-custom-component";

const VoucherMessageSection = ({ messageTitle, messageDescription }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Messages</div>

      <Description title="Title" value={messageTitle} />

      <Description title="Message" value={messageDescription} />
    </div>
  );
};

export default VoucherMessageSection;
