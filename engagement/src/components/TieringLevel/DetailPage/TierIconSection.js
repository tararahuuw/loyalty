import React from "react";

const TierIconSection = ({ icon, level }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Icon</div>

      <div className="flex flex-col self-start">
        <div className="rounded-t-md border border-neutral50 p-4">
          <img src={icon} className="h-40 w-40" alt="badge-icon" />
        </div>
        <div className="rounded-b-md border border-t-0 border-neutral50 flex justify-center py-2 bg-primary50">
          <p className="font-semibold">Level {level}</p>
        </div>
      </div>
    </div>
  );
};

export default TierIconSection;
