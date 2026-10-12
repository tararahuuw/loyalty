import React from "react";
import GeneralEarningPoint from "./GeneralEarningPoint";
import EarningPoint from "./EarningPoint";

const PointSection = ({
  isPointActive,
  pointProcessingMethod,
  method,
  pointEarned,
  pointEarnedException,
  parameters,
  segmentedCustomers,
  isPointEarnedNotification,
  isPointMultiplier,
  senderName,
  subject,
  channels,
  pointExpiration,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-medium text-xl border-b border-neutral40 pb-2">Point</p>

      {isPointActive && (
        <div className="grid grid-cols-2 gap-2">
          {pointProcessingMethod !== "upload point" && (
            <GeneralEarningPoint
              method={method}
              pointEarned={pointEarned}
              pointEarnedException={pointEarnedException}
              parameters={parameters}
              segmentedCustomers={segmentedCustomers}
            />
          )}

          <EarningPoint
            isPointEarnedNotification={isPointEarnedNotification}
            isPointMultiplier={isPointMultiplier}
            pointExpiration={pointExpiration}
            senderName={senderName}
            subject={subject}
            channels={channels}
            method={method}
            pointProcessingMethod={pointProcessingMethod}
          />
        </div>
      )}
    </div>
  );
};

export default PointSection;
