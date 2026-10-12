import React, { useState } from "react";
import DataTable from "prezent/DataTable";
import SearchDropDown from "prezent/SearchDropDown";
import MessagePreviewSection from "../../CampaignFormPage/RewardsSection/RewardDistributionSection/MessagePreviewSection";

const RecipientListSection = ({ recipients = [], channels = [], templates, data }) => {
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Reward Name",
    value: "rewardName",
  });
  const [dataSearch, setDataSearch] = useState("");
  const dataOptions = [{ option: "Reward Name", value: "rewardName" }];

  const columns = [
    {
      header: "Recipient Data",
      assessor: "recipient",
      Cell: (row) => {
        return (
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="font-semibold text-black text-sm truncate">{row.recipientName}</p>

              <p className="font-normal text-neutral300 text-xs truncate">{row.phoneNumber}</p>
              <p className="font-normal text-neutral300 text-xs truncate">{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Distribution",
      assessor: "distribution",
      Cell: (row) => {
        return <p>{channels.join(", ")}</p>;
      },
    },
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return <p>{row.reward}</p>;
      },
    },
    {
      header: "Quantity",
      assessor: "quantity",
      Cell: (row) => {
        return <p>{row.quantity}</p>;
      },
    },
  ];

  return (
    <div className="bg-neutral20 rounded-lg p-6 flex flex-col gap-3">
      <p className="pb-2 font-semibold text-lg">Recipient List</p>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 bg-white rounded-lg p-4 flex flex-col gap-4">
          <SearchDropDown
            options={dataOptions}
            placeholderSearch="Search Here"
            filterDropdown={dataFilterSearch}
            setFilterDropdown={setDataFilterSearch}
            onEnterPress={setDataSearch}
          />

          <DataTable
            staticData={recipients}
            columns={columns}
            options={{ pagination: false, isRounded: true }}
            searchKeyword={dataSearch}
            onClickRow={() => {}}
          />
        </div>

        <MessagePreviewSection
          templates={templates}
          selectedTemplateId={data?.campaignPointInactive?.rewardDistributionNotification?.whatsappTemplate}
        />
      </div>
    </div>
  );
};

export default RecipientListSection;
