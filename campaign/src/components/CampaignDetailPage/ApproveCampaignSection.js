import React from "react";
import { InfoIcon, XIcon, CheckIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const ApproveCampaignSection = ({ onApprove, onReject }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border border-primary500 bg-primary50">
      <div className="flex items-center gap-2">
        <InfoIcon className="text-primary500" size={20} weight="fill" />
        <p className="font-semibold text-base">Approve Campaign Request?</p>
      </div>

      <div className="flex items-center gap-2">
        <OutlineButton
          title={
            <div className="flex items-center gap-2">
              <XIcon />
              Reject
            </div>
          }
          onClick={onReject}
        />

        <PrimaryButton
          title={
            <div className="flex items-center gap-2">
              <CheckIcon />
              Approve
            </div>
          }
          onClick={() => onApprove({ reason: "", status: "active" })}
        />
      </div>
    </div>
  );
};

export default ApproveCampaignSection;
