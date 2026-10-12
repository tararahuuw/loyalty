import React from "react";

const PhotoSection = ({ image }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Photo</div>

      <img
        src={`${process.env.REACT_APP_API_URL}/voucher/${image}`}
        alt={image}
        className="object-contain rounded-lg"
        style={{
          width: "347px",
          height: "192px",
        }}
      />
    </div>
  );
};

export default PhotoSection;
