import React from "react";
import { Description } from "sprint-asia-custom-component";

const ClientSection = ({ client, division, roleAccess }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Client Information</div>

      <div className="flex flex-wrap gap-2">
        {roleAccess !== "Client Administrator" && (
          <div className="flex-1">
            <Description title="Client Name" value={client} />
          </div>
        )}
        <div className="flex-1">
          <Description title="Division Name" value={division} />
        </div>
      </div>
    </div>
  );
};

export default ClientSection;
