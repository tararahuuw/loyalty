import { Info } from "@phosphor-icons/react";
import React from "react";
import { Description } from "sprint-asia-custom-component";

const TierDetailSection = ({ level, isDownGrade, seasonPeriod, amountTransaction }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Tier Detail</div>

      <div className="bg-primary50 px-4 py-3 flex gap-2 rounded-md">
        <div className="flex gap-1">
          <Info className="text-primary500" size={24} />
          <p>
            {level === 1
              ? "Tier Level 1 has no transaction targets and will not have a season as it serves as the base level."
              : "The season determination for each user ID will start from the beginning of the year when the user registers for the loyalty program in the app. The season will only appear when tier downgrade activated"}
          </p>
        </div>
      </div>

      {level > 1 && (
        <>
          <p className={`${isDownGrade ? "text-success500" : "text-danger500"} font-semibold`}>
            {isDownGrade ? "Tier Downgrade Activated" : "Tier Downgrade Not Activated"}
          </p>

          {isDownGrade ? <Description title="Tier Season Period" value={seasonPeriod} /> : null}

          <div className="flex flex-col">
            <p>Amount Transaction</p>
            <p className="text-neutral300 text-xs">
              The total transaction amount that must be achieved to reach the membership type above or maintain tier
              level.
            </p>
          </div>

          <Description title="Target Amount Transaction" value={`Rp ${amountTransaction?.toLocaleString()}`} />
        </>
      )}
    </div>
  );
};

export default TierDetailSection;
