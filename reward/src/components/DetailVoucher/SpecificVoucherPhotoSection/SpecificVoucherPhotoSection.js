import React from "react";

const SpecificVoucherPhotoSection = ({ specificPhotos }) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Specific Voucher Photo
      </div>

      <div className="grid grid-cols-6 gap-4">
        {specificPhotos?.length
          ? specificPhotos.map((photo, idx) => (
              <div key={idx} className="flex flex-row items-center gap-2 col-span-3" style={{ width: "fit-content" }}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/voucher/${photo.specificVoucherPhotoUrl}`}
                  alt={photo.specificVoucherPhotoUrl}
                  className="w-36 h-20 object-cover rounded-md"
                />
                <p className="text-sm font-semibold">{photo.clientName}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default SpecificVoucherPhotoSection;
