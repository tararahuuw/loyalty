import React from "react";
import { Description } from "sprint-asia-custom-component";

const InformationSection = ({ image, templateName, client, division }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Voucher Information
      </div>

      {image ? (
        <Description title="Background" image={`${process.env.REACT_APP_API_URL}/template_voucher/${image}`} />
      ) : (
        <div className="w-full">
          <p className="text-sm font-normal text-black mb-1">Background</p>
          <div className="w-52 h-52 rounded-lg mt-1" style={{ background: templateName }} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Description title="Template Name" value={templateName} />
        <Description title="Client" value={client} />
        <Description title="Division" value={division} />
      </div>
    </div>
  );
};

export default InformationSection;
