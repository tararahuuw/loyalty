import React from "react";
import { Description } from "sprint-asia-custom-component";

const DetailSection = ({ name, denom, stock, price, period, description, howTo, term }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Detail</div>

      <Description title="Product Name" value={name} />

      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <Description title="Denom" value={denom?.toLocaleString()} />
        </div>

        <div className="flex-1">
          <Description title="Stock" value={stock?.toLocaleString()} />
        </div>

        <div className="flex-1">
          <Description title="Voucher Price" value={`Rp ${price?.toLocaleString()}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <Description title="Validity Period" value={period} />
        </div>

        <div className="flex-1" />
      </div>

      <div style={{ wordBreak: "break-word" }}>
        <Description title="Description" value={description} />
      </div>

      <div style={{ wordBreak: "break-word" }}>
        <Description title="How to redeem" value={howTo} />
      </div>

      <div style={{ wordBreak: "break-word" }}>
        <Description title="Term & condition" value={term} />
      </div>
    </div>
  );
};

export default DetailSection;
