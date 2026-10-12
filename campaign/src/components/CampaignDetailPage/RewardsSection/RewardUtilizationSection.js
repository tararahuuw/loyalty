import React from "react";
import ToolTip from "prezent/ToolTip";

const RewardUtilizationSection = ({ rewardUtilizationMethod }) => {
  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Utilization</p>
          <ToolTip
            id="reward-utilization"
            message="Choose how rewards will be delivered, redeemed, and tracked after processing. This option defines how rewards are made available to Customers and how their usage is managed within the loyalty program"
          />
        </div>

        <div className="bg-white rounded-lg flex flex-col gap-2 p-4">
          <p className="font-semibold text-sm">
            {rewardUtilizationMethod === "api"
              ? "API"
              : rewardUtilizationMethod === "pwa"
              ? "PWA"
              : rewardUtilizationMethod === "dashboard"
              ? "Dashboard"
              : rewardUtilizationMethod === "download point"
              ? "Download Point"
              : rewardUtilizationMethod === "download"
              ? "Download"
              : ""}
          </p>
          {rewardUtilizationMethod === "api" && (
            <div className="text-sm">
              <span className="text-neutral300">
                Reward is delivered or redeemed through system integration, allowing external systems or partners to
                automatically trigger reward processes.{" "}
                <span className="text-primary500 hover:underline cursor-pointer">Click here</span> for more details.
              </span>
            </div>
          )}

          {rewardUtilizationMethod === "pwa" && (
            <div className="text-sm">
              <span className="text-neutral300">
                Reward is accessed and redeemed directly by Customers through the Progressive Web App (PWA), enabling
                self-service redemption.
              </span>
            </div>
          )}

          {rewardUtilizationMethod === "dashboard" && (
            <div className="text-sm">
              <span className="text-neutral300">Reward is managed through the </span>
              <span className="text-primary500 font-medium hover:underline cursor-pointer">Customer 360</span>
              <span className="text-neutral300">
                {" "}
                menu when points are active, or sent to selected Customers via messaging channels when points are
                inactive.
              </span>
            </div>
          )}

          {rewardUtilizationMethod === "download" && (
            <div className="text-sm">
              <span className="text-neutral300">
                Reward is provided in downloadable files (e.g., CSV, Excel, PDF) for offline distribution or import into
                other systems.
              </span>
            </div>
          )}

          {rewardUtilizationMethod === "download point" && (
            <div className="text-sm">
              <span className="text-neutral300">
                Rewards are provided outside the system, and points generated from the campaign can be downloaded from
                <span className="text-primary500 cursor-pointer hover:underline"> the Customer 360 menu.</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardUtilizationSection;
