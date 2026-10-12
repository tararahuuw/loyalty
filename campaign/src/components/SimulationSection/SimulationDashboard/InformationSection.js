import React from "react";
import { InfoIcon } from "@phosphor-icons/react";

const InformationSection = () => {
  return (
    <div className="bg-primary50 rounded-md p-4 flex gap-2 items-start">
      <InfoIcon size={18} className="text-primary500 flex-shrink-0" />

      <div className="text-sm">
        <span>This menu allows manual uploading of </span>
        <span className="font-bold">customer transactions </span>
        <span>once a </span>
        <span className="font-bold">campaign </span>
        <span>has been created. </span>
        <span>Uploaded </span>
        <span className="font-bold">transactions </span>
        <span>
          are matched with the campaigns defined parameters so the system can correctly accumulate customer points.
        </span>
      </div>
    </div>
  );
};

export default InformationSection;
