import React, { useState } from "react";
import DataTable from "prezent/DataTable";
import { SearchDropdown } from "sprint-asia-custom-component";
import moment from "moment";

const RewardListSection = ({ rewards = [], rewardUtilizationMethod }) => {
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Reward Name",
    value: "name",
  });
  const [dataSearch, setDataSearch] = useState("");

  const dataOptions = [
    { option: "Reward Name", value: "name" },
    { option: "Reward ID", value: "id" },
    { option: "Price", value: "price" },
  ];

  const columns = [
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-xs">
              {row.type} - {row.category}
            </p>
          </div>
        );
      },
    },
    {
      header: "Stock",
      assessor: "stock",
      Cell: (row) => {
        return (
          <div
            className={
              row.type === "PPOB"
                ? "text-success500"
                : `${row.stock < 50 ? "text-danger500" : "text-success500"} font-medium`
            }
          >
            {row.type === "PPOB" ? "unlimited" : row.stock.toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Price",
      assessor: "price",
      Cell: (row) => {
        return <div>Rp {row.price.toLocaleString("id", "ID")}</div>;
      },
    },
    {
      header: "Point Needed",
      assessor: "point",
      Cell: (row) => {
        return <div>{row.pointNeeded?.toLocaleString("id", "ID") || 0}</div>;
      },
    },
    {
      header: "Owned QTY",
      assessor: "ownedQuantity",
      Cell: (row) => {
        return <div>{row.ownedQty?.toLocaleString("id", "ID") || 0}</div>;
      },
    },
    {
      header: "Validity Period",
      assessor: "validityStartDate",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-medium">{moment(row.startDate).format("DD MMM YYYY")}</p>
            <p className="font-normal text-neutral80 text-xs">Until {moment(row.endDate).format("DD MMM YYYY")}</p>
          </div>
        );
      },
    },
    rewardUtilizationMethod === "download" && {
      header: "Download QTY",
      assessor: "downloadQty",
      Cell: (row) => {
        return <div>{row.quantity?.toLocaleString("id", "ID") || 0}</div>;
      },
    },
  ];

  const totalRewardsQuantity = rewards.reduce((sum, reward) => sum + reward.ownedQty, 0);

  const downloadedRewards = rewards.filter((reward) => reward.quantity > 0);
  const totalDownloadedRewardsQuantity = downloadedRewards.reduce((sum, reward) => sum + reward.quantity, 0);

  return (
    <div className="flex flex-col gap-4 bg-neutral20 rounded-lg p-6">
      <p className="text-lg font-semibold leading-6 text-left">Reward List</p>

      <SearchDropdown
        options={dataOptions}
        placeholderSearch="Search Here"
        filterDropdown={dataFilterSearch}
        setFilterDropdown={setDataFilterSearch}
        onEnterPress={setDataSearch}
      />

      <div className="flex flex-col">
        <DataTable
          columns={columns}
          staticData={rewards.filter((reward) => reward.name.toLowerCase().includes(dataSearch.toLocaleLowerCase()))}
          options={{ pagination: false }}
          searchKeyword={dataSearch}
          onClickRow={() => {}}
        />

        <div className="border border-t-0 rounded-b-md border-neutral40 p-2 flex flex-col gap-2">
          <div className="flex flex-col bg-primary50 rounded-xl px-4 py-2 items-end gap-2">
            <div className="flex gap-20">
              <p className="font-semibold">TOTAL OWNED QTY ({rewards.length.toLocaleString("id", "ID")} REWARD)</p>
              <p className="font-semibold">{totalRewardsQuantity.toLocaleString("id", "ID")}</p>
            </div>
            {rewardUtilizationMethod === "download" && (
              <div className="flex gap-20">
                <p className="font-semibold">
                  TOTAL DOWNLOADED QTY ({downloadedRewards.length.toLocaleString("id", "ID")} REWARD)
                </p>
                <p className="font-semibold">{totalDownloadedRewardsQuantity.toLocaleString("id", "ID")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardListSection;
