import React from "react";
import { Description } from "sprint-asia-custom-component";

const AddressInformationSection = ({ province, address, city, postalCode, district }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-5">
          <Description title="Province" value={province} />
          <Description title="Detail Address" value={address} />
        </div>
        <div className="flex flex-col gap-5">
          <Description title="City" value={city} />
          <Description title="Postal Code" value={postalCode} />
        </div>
        <div className="flex flex-col gap-5">
          <Description title="District" value={district} />
        </div>
      </div>
    </div>
  );
};

export default AddressInformationSection;
