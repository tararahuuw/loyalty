import React from "react";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import moment from "moment";

const CampaignInformationSection = ({ name, startDate, endDate, description }) => {
  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Campaign Information
      </div>

      <div className="grid grid-cols-3 text-sm">
        <div className="flex flex-col gap-1">
          <p>Campaign Name</p>
          <p className="font-medium">{name}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p>Start Date Period</p>
          <div className="flex items-center gap-2">
            <CalendarBlankIcon size={20} />
            <p className="font-medium">{moment(startDate).format("DD MMM YYYY HH:mm")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p>End Date Period</p>
          <div className="flex items-center gap-2">
            <CalendarBlankIcon size={20} />
            <p className="font-medium">{moment(endDate).format("DD MMM YYYY HH:mm")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <p>Campaign Description</p>
        <p className="font-medium whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default CampaignInformationSection;
