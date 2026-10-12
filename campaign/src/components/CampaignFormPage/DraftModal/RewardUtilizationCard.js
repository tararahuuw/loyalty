import React from "react";
import { GearIcon } from "@phosphor-icons/react";

const RewardUtilizationCard = ({
  rewardUtilizationMethod = "",
  channels = [],
  senderId,
  subject,
  rewardASssignmentMethod,
  senderIds = [],
}) => {
  const selectedSenderId = senderIds.filter((sender) => sender.id === senderId)[0]?.senderId;
  return (
    <div className="col-span-3 h-full">
      <div className="flex flex-col gap-2 h-full">
        <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-3 h-full">
          <div className="flex justify-between items-center border-b border-neutral40 pb-2">
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

          <div className="bg-primary50 p-2 rounded-lg flex flex-col gap-2">
            <p className="font-medium text-sm">Reward Distribution Notification</p>
            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Channel</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{channels.join(", ")}</p>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Sender ID</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{selectedSenderId}</p>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Subject</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{subject}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium text-sm">Reward Assignment Method</p>
            <div className="flex items-center gap-2 col-span-2">
              &nbsp;:
              <p className="font-medium text-sm">
                {rewardASssignmentMethod.charAt(0).toUpperCase() + rewardASssignmentMethod.slice(1)} Reward
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardUtilizationCard;
