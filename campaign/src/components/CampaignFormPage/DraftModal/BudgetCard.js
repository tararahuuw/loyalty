import React from "react";
import { WalletIcon, InfinityIcon } from "@phosphor-icons/react";

const BudgetCard = ({ recipients = [], rewards = [], rewardUtilizationMethod, pointProcessingMethod }) => {
  const rewardMap = rewards.reduce((acc, reward) => {
    acc[reward.id] = reward.price;
    return acc;
  }, {});

  const totalCostFromRecipients = recipients.reduce((sum, recipient) => {
    const price = rewardMap[recipient.rewardId] || 0;
    return sum + price * recipient.quantity;
  }, 0);

  const totalCostDownloadedRewards = rewards.reduce((sum, reward) => {
    if (reward.quantity && reward.quantity > 0) {
      return sum + reward.quantity * reward.price;
    }
    return sum;
  }, 0);

  const totalCostRewards = rewards.reduce((sum, reward) => {
    return sum + reward.ownedQuantity * reward.price;
  }, 0);

  const uniqueVoucherCount = new Set(recipients.map((r) => r.rewardId)).size;

  const totalRecipientRewardQuantity = recipients.reduce((sum, r) => sum + (r.quantity || 0), 0);

  const rewardsWithQuantity = rewards.filter((reward) => reward.quantity > 0);

  const totalDownloadedQuantity = rewardsWithQuantity.reduce((sum, r) => {
    if (r.quantity && r.quantity > 0) {
      return sum + r.quantity;
    }
    return sum;
  }, 0);

  const totalRewardQuantity = rewards.reduce((sum, r) => sum + (r.ownedQuantity || 0), 0);

  return (
    <div className="h-full">
      <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between pb-2 border-b border-neutral40">
          <p className="font-medium text-base">Budget</p>
          <WalletIcon size={20} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm">Rewards Quantity</p>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Voucher (
              {rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point"
                ? uniqueVoucherCount.toLocaleString("id-ID")
                : rewardUtilizationMethod === "download"
                ? rewardsWithQuantity.length
                : rewards.length}{" "}
              Selected ) (
              {rewardUtilizationMethod === "dashboard" && pointProcessingMethod !== "upload point"
                ? totalRecipientRewardQuantity.toLocaleString("id-ID")
                : rewardUtilizationMethod === "download"
                ? totalDownloadedQuantity.toLocaleString("id-ID")
                : totalRewardQuantity}{" "}
              Qty)
            </p>

            {pointProcessingMethod === "upload point" ||
            rewardUtilizationMethod === "pwa" ||
            rewardUtilizationMethod === "api" ||
            rewardUtilizationMethod === "download point" ? null : (
              <p className="text-sm">
                Rp{" "}
                {rewardUtilizationMethod === "dashboard"
                  ? totalCostFromRecipients.toLocaleString("id-ID")
                  : rewardUtilizationMethod === "download"
                  ? totalCostDownloadedRewards.toLocaleString("id-ID")
                  : totalCostRewards.toLocaleString("id-ID")}
              </p>
            )}
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-sm">Goods ({totals["goods"]}) (45 Qty)</p>
            <p className="text-sm">Rp 2.725.000</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm w-40">Cashback & Discounts ({totals["cashback & discounts"]}) (20 Qty)</p>
            <p className="text-sm">Rp 528.000</p>
          </div> */}
        </div>

        {pointProcessingMethod === "upload point" ||
        rewardUtilizationMethod === "pwa" ||
        rewardUtilizationMethod === "api" ||
        rewardUtilizationMethod === "download point" ? null : (
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Total Cost</p>
            <p className="font-semibold text-sm">
              Rp{" "}
              {rewardUtilizationMethod === "dashboard"
                ? totalCostFromRecipients.toLocaleString("id-ID")
                : rewardUtilizationMethod === "download"
                ? totalCostDownloadedRewards.toLocaleString("id-ID")
                : totalCostRewards.toLocaleString("id-ID")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
