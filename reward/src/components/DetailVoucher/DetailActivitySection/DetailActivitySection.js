import React from "react";
import { Description } from "sprint-asia-custom-component";

const DetailActivitySection = ({ createdBy, editedBy, createDate, editDate }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Detail Activity</div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <Description title="Created By" value={createdBy || "-"} subtitle={createDate} />
        </div>

        <div className="flex-1">
          <Description title="Last Edited By" value={editedBy || "-"} subtitle={editDate} />
        </div>
      </div>
    </div>
  );
};

export default DetailActivitySection;
