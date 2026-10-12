import React from "react";

const ParameterInformation = ({ parameterDetail }) => {
  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Basic Information</div>

      <div className="pt-4 pb-4 pr-4 flex flex-col gap-3">
        <div>
          <p className="text-neutral500 font-normal text-sm mt-1">{`Parameter name {Key}`}</p>
          <p className="text-black font-semibold text-base">{parameterDetail?.parameterName || "-"}</p>
          <p className="text-neutral500 font-normal text-sm mt-4">Type</p>
          <p className="text-black font-semibold text-base">{parameterDetail?.type || "-"}</p>

          <div className="grid grid-cols-2">
            {parameterDetail?.status?.length
              ? parameterDetail.status.map((status, idx) => (
                  <div key={idx}>
                    <p className="text-neutral500 font-normal text-sm mt-4">Status {idx + 1}</p>
                    <p className="text-black font-semibold text-base">{status.value}</p>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterInformation;
