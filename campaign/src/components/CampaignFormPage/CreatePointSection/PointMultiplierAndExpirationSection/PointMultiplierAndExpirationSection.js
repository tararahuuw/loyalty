import React, { useEffect } from "react";
import ToolTip from "prezent/ToolTip";
import DatePicker from "prezent/DatePicker";
import { Switch } from "sprint-asia-custom-component";

const PointMultiplierAndExpirationSection = ({ formik }) => {
  const eligibleParameters = ["Transaction Amount (Rp)", "Transaction Frequency", "Distance (M)", "Distance (KM)"];

  const hasEligibleParameter = formik.values.pointParameters.some((param) => eligibleParameters.includes(param.name));

  useEffect(() => {
    if (formik.values.pointParameters.length) {
      if (!hasEligibleParameter) {
        formik.setFieldValue("isPointMultiplier", false);
      }
    }
  }, [hasEligibleParameter, formik.values.pointParameters]);

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
        <div className={`flex flex-col gap-4`}>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold leading-6 text-left">Point Multiplier</p>
            <ToolTip
              id="point-multiplier"
              message="When enabled, points will be multiplied based on the minimum value among transaction amount, quantity, or frequency—whichever is met first. Note: If you enter a maximum quantity, it will not affect the multiplier calculation."
            />
            <Switch
              checked={formik.values.isPointMultiplier}
              onChange={() => formik.setFieldValue("isPointMultiplier", !formik.values.isPointMultiplier)}
              isEdit={formik.values.pointProcessingMethod !== "upload point" && hasEligibleParameter}
            />
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
            <DatePicker
              className="max-w-sm"
              placeholder="Select expiration date"
              isRange={false}
              mode="default"
              value={[formik.values.pointExpiration]}
              onChange={(value) => formik.setFieldValue("pointExpiration", value)}
              onReset={() => formik.setFieldValue("pointExpiration", "")}
            />
            <p className="text-xs">Set when loyalty points expire to manage liabilities and encourage redemption.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointMultiplierAndExpirationSection;
