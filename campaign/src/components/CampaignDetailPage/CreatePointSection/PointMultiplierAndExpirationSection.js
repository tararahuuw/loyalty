import React from "react";
import ToolTip from "prezent/ToolTip";
import DatePicker from "prezent/DatePicker";
import { Chip } from "sprint-asia-custom-component";
import moment from "moment";

const PointMultiplierAndExpirationSection = ({ isPointMultiplied, expirationDate }) => {
  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold leading-6 text-left">Point Multiplier</p>
            <ToolTip
              id="point-multiplier"
              message="When enabled, points will be multiplied based on the minimum value among transaction amount, quantity, or frequency—whichever is met first. Note: If you enter a maximum quantity, it will not affect the multiplier calculation."
            />
            <div>
              <Chip
                title={isPointMultiplied ? "Active" : "Inactive"}
                type={isPointMultiplied ? "success" : "neutral"}
              />
            </div>
          </div>

          <p className="text-xs">Enables multiplying points earn based on the amount transaction created</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold leading-6 text-left">Point Expiration</p>
            <ToolTip
              id="point-expiration"
              message="Points will never expire; Customers have unlimited time to redeem points for rewards."
            />
          </div>

          <div className="p-4 rounded-lg bg-white flex flex-col gap-2">
            {expirationDate ? (
              <DatePicker
                className="max-w-sm"
                placeholder="Select expiration date"
                isRange={false}
                disabled
                value={[moment(expirationDate).format("YYYY-MM-DD")]}
              />
            ) : null}
            <p className="text-xs">Set when loyalty points expire to manage liabilities and encourage redemption.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointMultiplierAndExpirationSection;
