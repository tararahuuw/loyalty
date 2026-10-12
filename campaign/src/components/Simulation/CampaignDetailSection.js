import React, { useRef } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { CaretDownIcon } from "@phosphor-icons/react";
import PointSection from "./PointSection/PointSection";
import moment from "moment";

const CampaignDetailSection = ({
  name,
  description,
  startDate,
  endDate,
  isPointActive,
  pointProcessingMethod,
  method,
  parameters,
  pointEarned,
  pointEarnedException,
  segmentedCustomers,
  channels,
  senderName,
  isPointEarnedNotification,
  isPointMultiplier,
  subject,
  pointExpiration,
}) => {
  const contentRef = useRef(null);
  const { isOpen: createPointIsOpen, toggle: toggleCreatePoint } = useDisclosure(true);

  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold leading-6 text-left">{name}</p>

        <a className="cursor-pointer" onClick={toggleCreatePoint}>
          <CaretDownIcon
            className={`transform ${
              createPointIsOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300 ease-in-out`}
          />
        </a>
      </div>

      <p className="text-sm font-normal border-b border-neutral40 pb-2">
        {moment(startDate).format("DD MMM YYYY HH:mm")} - {moment(endDate).format("DD MMM YYYY HH:mm")}
      </p>

      <div
        ref={contentRef}
        style={{
          maxHeight: !createPointIsOpen ? 0 : 2000,
        }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300 p-1"
      >
        <div className="flex flex-col gap-1">
          <p>Campaign Description</p>
          <p className="font-medium whitespace-pre-line">{description}</p>
        </div>

        <PointSection
          isPointActive={isPointActive}
          pointProcessingMethod={pointProcessingMethod}
          method={method}
          parameters={parameters}
          pointEarned={pointEarned}
          pointEarnedException={pointEarnedException}
          segmentedCustomers={segmentedCustomers}
          channels={channels}
          isPointEarnedNotification={isPointEarnedNotification}
          isPointMultiplier={isPointMultiplier}
          senderName={senderName}
          subject={subject}
          pointExpiration={pointExpiration}
        />
      </div>
    </div>
  );
};

export default CampaignDetailSection;
