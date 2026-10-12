import React from "react";
import { Description } from "sprint-asia-custom-component";

const BasicInformationSection = ({
  roleAccess,
  clientName,
  storeId,
  picName,
  storeCode,
  outletName,
  picPhoneNumber,
  outletPhoneNumber,
  email,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      {roleAccess === "System Administrator" ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-5">
            <Description title="Client Name" value={clientName} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-5">
            <Description title="Store ID" value={storeId} />
            <Description title="PIC" value={picName} />
            <Description title="Store Code" value={storeCode} />
          </div>

          <div className="flex flex-col gap-5">
            <Description title="Outlet Name" value={outletName} />
            <Description title="PIC Phone Number" value={picPhoneNumber} />
          </div>

          <div className="flex flex-col gap-5">
            <Description title="Outlet Phone Number" value={outletPhoneNumber} />
            <Description title="Email" value={email} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformationSection;
