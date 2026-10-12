import React from "react";
import { UsersFourIcon, InfoIcon } from "@phosphor-icons/react";

const RecipientListCard = ({ recipients = [], channels = [] }) => {
  return (
    <div className="col-span-2">
      <div className="flex flex-col gap-2">
        <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-neutral40 pb-2">
            <p className="font-medium text-base">Recipient List</p>

            <UsersFourIcon size={20} />
          </div>

          <div className="bg-primary50 p-2 rounded-lg flex flex-col gap-2">
            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Total Recipients</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{recipients.length} Recipients</p>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">SMS</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{channels.includes("SMS") ? recipients.length : 0} Recipients</p>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">WhatsApp</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                <p className="font-medium text-sm">
                  {channels.includes("WhatsApp") ? recipients.length : 0} Recipients
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Email</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">{channels.includes("Email") ? recipients.length : 0} Recipients</p>
              </div>
            </div>
          </div>

          <div className="text-xs flex gap-2">
            <span>
              <InfoIcon className="text-primary500" size={18} />
            </span>
            <span>
              The number of tokens used in campaigns that distribute rewards will be deducted from the available tokens
              for each messaging channel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientListCard;
