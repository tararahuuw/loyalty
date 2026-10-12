import React from "react";
import { GiftIcon } from "@phosphor-icons/react";
import DataTable from "prezent/DataTable";

const SelectedRewardCard = ({ rewards = [], rewardUtilizationMethod }) => {
  const columns = [
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return <p className="font-semibold text-black text-sm">{row.name}</p>;
      },
    },
    {
      header: "Type",
      assessor: "type",
      Cell: (row) => {
        return <p className="font-semibold text-black text-sm">{row.type}</p>;
      },
    },
    {
      header: "Price",
      assessor: "price",
      Cell: (row) => {
        return <div>Rp {row.price?.toLocaleString("id", "ID")}</div>;
      },
    },
    {
      header: "Point Needed",
      assessor: "point",
      Cell: (row) => {
        return <div>{row.pointNeeded?.toLocaleString("id", "ID")}</div>;
      },
    },
    {
      header: "Owned QTY",
      assessor: "ownedQuantity",
      Cell: (row) => {
        return <div>{row.ownedQuantity?.toLocaleString("id", "ID")}</div>;
      },
    },

    rewardUtilizationMethod === "download" && {
      header: "Download Qty",
      assessor: "quantity",
      Cell: (row) => {
        return <div>{row.quantity?.toLocaleString("id", "ID")}</div>;
      },
    },
  ];

  const totalRewardsQuantity = rewards.reduce((sum, reward) => sum + reward.ownedQuantity, 0);
  const downloadedRewards = rewards.filter((reward) => reward.quantity > 0);
  const totalDownloadedRewardsQuantity = downloadedRewards.reduce((sum, reward) => sum + reward.quantity, 0);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-2 col-span-3">
      <div className="flex items-center justify-between pb-2 border-b border-neutral40">
        <p className="font-medium text-base">Selected Reward</p>
        <GiftIcon size={20} />
      </div>

      <div className="overflow-hidden rounded-md">
        <DataTable
          columns={columns}
          staticData={rewards}
          options={{ pagination: false, isRounded: false }}
          onClickRow={() => {}}
          maxHeight="400px"
        />
        <div className="flex flex-col gap-2 bg-primary50 p-2">
          <div className="flex justify-between items-center">
            <p className="text-primary500 font-medium text-xs">
              TOTAL REWARD QTY ({rewards.length.toLocaleString("id", "ID")} SELECTED)
            </p>
            <p className="text-primary500 font-semibold text-xs">{totalRewardsQuantity.toLocaleString("id-ID")}</p>
          </div>

          {rewardUtilizationMethod === "download" && (
            <div className="flex justify-between items-center">
              <p className="text-primary500 font-medium text-xs">
                TOTAL DOWNLOADED QTY ({downloadedRewards.length.toLocaleString("id", "ID")} REWARD)
              </p>
              <p className="text-primary500 font-semibold text-xs">
                {totalDownloadedRewardsQuantity.toLocaleString("id", "ID")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedRewardCard;
