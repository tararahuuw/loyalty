import moment from "moment";
import React from "react";
import { Description } from "sprint-asia-custom-component";

const DetailActivitySection = ({ creadtedBy, createdDate, updatedBy, updatedDate }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Detail Activity</div>

      <div className="grid grid-cols-2">
        <Description
          title="Created By"
          value={creadtedBy || "-"}
          subtitle={moment(createdDate).format("DD MMM YYYY, HH:mm")}
        />
        <Description
          title="Last Edited By"
          value={updatedBy || "-"}
          subtitle={moment(updatedDate).format("DD MMM YYYY, HH:mm")}
        />
      </div>
    </div>
  );
};

export default DetailActivitySection;
