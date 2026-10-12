import React from "react";
import moment from "moment";

const EarningPointCard = ({
  pointProcessingMethod = "",
  method = "",
  isPointMultiplier,
  isPointEarnedNotification,
  pointExpiration,
  channels = [],
  senderId,
  subject,
  senderIds = [],
}) => {
  const selectedSenderId = senderIds.filter((sender) => sender.id === senderId)[0]?.senderId;
  return (
    <div
      className={`${
        pointProcessingMethod === "upload point" ? "col-span-2" : "col-span-1"
      } bg-white rounded-md shadow-sm p-4 flex flex-col gap-2`}
    >
      <div className="border-b border-neutral40 pb-2 grid grid-cols-3">
        <p className="font-medium text-base">Earning Point</p>
      </div>

      <div className="grid grid-cols-3">
        <p className="font-medium text-sm">Point Processing</p>
        <div className="flex items-center gap-2 col-span-2">
          :
          <p className="font-medium text-sm">
            {pointProcessingMethod === "api"
              ? "API"
              : pointProcessingMethod.replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <p className="font-medium text-sm">Apply for</p>
        <div className="flex items-center gap-2 col-span-2">
          :<p className="font-medium text-sm">{method.charAt(0).toUpperCase() + method.slice(1)} Customer</p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <p className="font-medium text-sm">Point Multiplier</p>
        <div className="flex items-center gap-2 col-span-2">
          :<p className="font-medium text-sm">{isPointMultiplier ? "Active" : "Inactive"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <p className="font-medium text-sm">Point Expiration</p>
        <div className="flex items-center gap-2 col-span-2">
          :
          <p className="font-medium text-sm">
            {pointExpiration ? moment(pointExpiration).format("D MMM YYYY 00:00") : "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <p className="font-medium text-sm">Point Earned Notification</p>
        <div className="flex items-center gap-2 col-span-2">
          :<p className="font-medium text-sm">{isPointEarnedNotification ? "Active" : "Inactive"}</p>
        </div>
      </div>

      {isPointEarnedNotification && (
        <div className="bg-primary50 p-2 rounded-lg flex flex-col gap-2">
          <div className="grid grid-cols-3">
            <p className="font-medium text-sm">Channel</p>
            <div className="flex items-center gap-2 col-span-2">
              :<p className="font-medium text-sm">{channels.join(", ")}</p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium text-sm">Sender ID</p>
            <div className="flex items-center gap-2 col-span-2">
              :<p className="font-medium text-sm">{selectedSenderId}</p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium text-sm">Subject</p>
            <div className="flex items-center gap-2 col-span-2">
              :<p className="font-medium text-sm">{subject}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningPointCard;
