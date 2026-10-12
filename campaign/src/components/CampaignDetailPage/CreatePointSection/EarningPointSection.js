import React from "react";
import ToolTip from "prezent/ToolTip";
import { TextInput } from "sprint-asia-custom-component";

const EarningPointSection = ({ method = "", segments = [], pointEarned = 0, pointEarnedException = 0, tiers = [] }) => {
  const getTierName = (id) => {
    return tiers.filter((tier) => tier.id === id)[0]?.tierName;
  };

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-2 text-lg font-semibold leading-6 text-left">
        <div className="flex items-center gap-2">
          <p>Earning Point</p>

          <ToolTip
            id="earning-point"
            message="When both the main rule and the exception rule are active, points will be calculated based on the exception rule first, followed by the main rule."
          />
        </div>
      </div>
      <div className="bg-white rounded-lg flex flex-col gap-2 p-4 text-sm">
        <p className="font-semibold">{method.charAt(0).toUpperCase() + method.slice(1)} Customer</p>
        <p className="text-neutral300">
          {method === "all"
            ? "Allows all Customers to earn points based on the transaction amount."
            : "Enables specific customer segments to earn points based on the transaction amount."}
        </p>

        {method === "all" && (
          <div className="grid grid-cols-2 text-sm">
            <div className="flex flex-col gap-2">
              <p>Point Earned</p>
              <p className="font-medium">{pointEarned.toLocaleString("id-ID")}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p>Point Earned for Exception</p>
              <p className="font-medium">{pointEarnedException.toLocaleString("id-ID")}</p>
            </div>
          </div>
        )}

        {method === "segmented" && segments.length ? (
          <div className="flex flex-col text-sm">
            <div className="flex">
              <div className="flex-1">
                <div className="bg-neutral20 border border-r-0 border-neutral40 rounded-tl-md h-10 flex items-center px-4">
                  <p className="font-normal text-sm">TIER LEVEL</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-neutral20 border border-r-0 border-neutral40 h-10 flex items-center px-4">
                  <p className="font-normal text-sm">POINT EARNED</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-neutral20 border border-neutral40 h-10 flex items-center px-4">
                  <p className="font-normal text-sm">POINT EARNED FOR EXCEPTION</p>
                </div>
              </div>
            </div>

            {segments.map((tier, idx) => (
              <div className="flex font-normal" key={idx}>
                <div className="border border-t-0 border-r-0 border-neutral40 p-4 flex-1">
                  <TextInput value={getTierName(tier.tierLevelId)} mode="disable" />
                </div>

                <div className="border border-t-0 border-r-0 border-neutral40 p-4 flex-1">
                  <TextInput value={tier.pointEarned.toLocaleString("id-ID")} mode="disable" />
                </div>

                <div className="border border-t-0 border-neutral40 p-4 flex-1">
                  <TextInput value={tier.pointEarnedException.toLocaleString("id-ID")} mode="disable" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EarningPointSection;
