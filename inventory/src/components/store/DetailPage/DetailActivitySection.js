import React from "react";
import { Description } from "sprint-asia-custom-component";
import moment from "moment";

const DetailActivitySection = ({ createdAt, updatedAt, createdBy, updatedBy }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="grid grid-cols-3 gap-6">
        <Description
          title="Created By"
          value={createdBy || "-"}
          subtitle={moment(createdAt).format("DD MMM YYYY, HH:mm")}
        />

        <Description
          title="Updated By"
          value={updatedBy || "-"}
          subtitle={updatedAt ? moment(updatedAt).format("DD MMM YYYY, HH:mm") : "-"}
        />
      </div>
    </div>
  );
};

export default DetailActivitySection;
