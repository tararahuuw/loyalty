import React from "react";
import { CalendarBlank, ArrowRight } from "@phosphor-icons/react";
import moment from "moment";

const VoucherDetailSection = ({
  denom = 0,
  stock = 0,
  price = 0,
  description,
  howToRedeem,
  termAndCondition,
  startDate,
  endDate,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-sm p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Detail</div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm">Denom</p>
          <p className="text-sm font-medium">{denom.toLocaleString("id", "ID")}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Stock</p>
          <p className="text-sm font-medium">{stock.toLocaleString("id", "ID")}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm">Voucher Price</p>
          <p className="text-sm font-medium">{price.toLocaleString("id", "ID")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">Validity Period</p>
        <div className="flex items-center gap-2">
          <CalendarBlank size={20} />
          <p className="text-sm font-medium">{moment(startDate).format("DD MMM YYYY HH:mm")}</p>
          <ArrowRight size={20} />
          <p className="text-sm font-medium">{moment(endDate).format("DD MMM YYYY HH:mm")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">Description</p>
        <p className="text-sm font-medium whitespace-pre-line">{description}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">How to redeem</p>
        <p className="text-sm font-medium whitespace-pre-line">{howToRedeem}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">Term & condition</p>
        <p className="text-sm font-medium whitespace-pre-line">{termAndCondition}</p>
      </div>
    </div>
  );
};

export default VoucherDetailSection;
