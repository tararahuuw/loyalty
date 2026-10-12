import React from "react";
import moment from "moment";

const DetailActivitySection = ({ parameterDetail }) => {
  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Detail Activity</div>

      <div className="pt-4 pb-4 pr-4 flex justify-between gap-3">
        <div className="flex-1">
          <p className="text-neutral500 font-normal text-sm mt-1">Created By</p>
          <p className="text-black font-semibold text-base">{parameterDetail?.createdBy || "-"}</p>
          <p className="text-black text-xs">{moment(parameterDetail?.createdAt).format("DD MMM YYYY, HH:mm")}</p>
        </div>

        <div className="flex-1">
          <p className="text-neutral500 font-normal text-sm mt-1">Last Edited By</p>
          <p className="text-black font-semibold text-base">{parameterDetail?.updatedBy || "-"}</p>
          <p className="text-black text-xs">{moment(parameterDetail?.updatedAt).format("DD MMM YYYY, HH:mm")}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailActivitySection;
