import React from "react";
import { Chip } from "sprint-asia-custom-component";
import RecipientTable from "./RecipientTable";
import { InfinityIcon } from "@phosphor-icons/react";

const SpecificVoucherTableSection = ({
  columns,
  recipients = [],
  setSelectedReward,
  selectedReward,
  rewards = [],
  checkAllData,
  onClickRow,
}) => {
  const handleSelectReward = (reward) => {
    if (selectedReward?.id === reward.id) {
      setSelectedReward(null);
    } else {
      setSelectedReward(reward);
    }
  };

  const totalRewardsQuantity = rewards.reduce((sum, reward) => sum + reward.ownedQuantity, 0);

  return (
    <div className="flex flex-col p-2 border border-neutral40 rounded-md gap-2">
      <div className="flex justify-between items-center p-4 bg-primary50 rounded-xl">
        <p className="font-semibold text-neutral300 text-sm">Remaining Rewards</p>
        <p className="font-semibold text-sm">{totalRewardsQuantity.toLocaleString("id", "ID")}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1 flex flex-col">
          <div className="bg-neutral20 px-4 py-7 rounded-t-md border border-neutral40 text-xs font-semibold">
            REWARD
          </div>

          <div className="flex flex-col w-full max-h-96 overflow-y-auto">
            {rewards.map((reward, idx) => (
              <div
                key={idx}
                className={`w-full flex items-center justify-between border border-t-0 border-neutral40 p-2 cursor-pointer ${
                  selectedReward?.id === reward.id ? "bg-primary50" : "bg-white"
                }`}
                onClick={() => handleSelectReward(reward)}
              >
                <p className="text-xs truncate max-w-[70%] overflow-hidden">{reward.name}</p>

                <div className="flex-shrink-0">
                  <Chip type="primary" title={reward.ownedQuantity} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <RecipientTable
            columns={columns}
            staticData={recipients}
            options={{ pagination: false, checkbox: true, isRounded: true }}
            onClickRow={onClickRow}
            maxHeight="450px"
            checkAllData={checkAllData}
            allChecked={!recipients.some((val) => !val.reward)}
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificVoucherTableSection;
