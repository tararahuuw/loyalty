import moment from "moment";
import React from "react";
import { DropdownText } from "sprint-asia-custom-component";

const HeaderSection = ({ formik, campaignList = [], selectedCampaignId, setSelectedCampaignId }) => {
  const options = campaignList.map((campaign) => ({
    option: `${campaign.name} - ${moment(campaign.startDate).format("DD MMM YYYY HH:mm")} - ${moment(
      campaign.endDate
    ).format("DD MMM YYYY HH:mm")}`,
    value: campaign.id,
  }));
  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <DropdownText
        className="max-w-xl"
        title="Campaign"
        options={options}
        currentOption={selectedCampaignId}
        onSelect={(e) => {
          setSelectedCampaignId(e.value);
          formik.setFieldValue("campaignId", e.value);
          formik.setFieldValue("tierLevelId", "");
          formik.setFieldValue("transactionDate", moment().format("YYYY-MM-DDTHH:mm"));
        }}
        placeholder="Choose Campaign"
      />
    </div>
  );
};

export default HeaderSection;
