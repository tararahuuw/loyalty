import React from "react";
import { GearIcon } from "@phosphor-icons/react";

const RewardUtilizationSmallCard = ({ rewardUtilizationMethod }) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 w-full">
              <p className="font-medium text-base">Reward Utilization</p>
              <div className="flex items-center gap-2 col-span-2 ml-2">
                :
                <p className="font-medium text-base">
                  {rewardUtilizationMethod === "api"
                    ? "API"
                    : rewardUtilizationMethod === "pwa"
                    ? "PWA"
                    : rewardUtilizationMethod.replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
              </div>
            </div>

            <GearIcon size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardUtilizationSmallCard;
