import React from "react";
import ToolTip from "prezent/ToolTip";

const RewardAssigningMethodSection = ({ rewardAssignmentMethod }) => {
  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Assigning Method</p>
          <ToolTip
            id="reward-assignment-method"
            message="Choose how vouchers are assigned to Customers —either randomly from the selected vouchers or specifically assigned per Customer."
          />
        </div>
      </div>

      <div className="bg-white rounded-lg flex flex-col gap-2 p-4 text-sm">
        <p className="font-semibold text-sm">
          {rewardAssignmentMethod === "specific" ? "Specific Reward" : "Random Voucher"}
        </p>
        <span className="text-neutral300">
          {rewardAssignmentMethod === "random"
            ? "Assign vouchers to Customers randomly based on the selected reward vouchers and the order of the recipient list."
            : "Assign a specific voucher to each Customer, ensuring they receive the exact voucher you have selected for them."}
        </span>
      </div>
    </div>
  );
};

export default RewardAssigningMethodSection;
