import React from "react";
import { Description } from "sprint-asia-custom-component";

const TierInformationSection = ({ roleAccess, level, name, client, division }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Information</div>

      <div className="grid grid-cols-3 gap-6">
        <Description title="Tier Level" value={`Level ${level}`} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Description title="Tier Name" value={name} />
        {roleAccess === "System Administrator" && <Description title="Client" value={client} />}
        <Description title="Division" value={division} />
      </div>
    </div>
  );
};

export default TierInformationSection;
