import React, { useEffect, useRef, useState } from "react";
import { Chip } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { CaretDownIcon } from "@phosphor-icons/react";
import ParameterSection from "../ParameterSection";
import PointProcessingSection from "./PointProcessingSection";
import EarningPointSection from "./EarningPointSection";
import PointMultiplierAndExpirationSection from "./PointMultiplierAndExpirationSection";
import PointEarnedNotificationSection from "./PointEarnedNotificationSection";

const CreatePointSection = ({ data, tiers, templates }) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const { isOpen: createPointIsOpen, toggle: toggleCreatePoint } = useDisclosure(false);

  useEffect(() => {
    if (contentRef.current) {
      if (createPointIsOpen) {
        setMaxHeight(contentRef.current.scrollHeight);
      } else {
        setMaxHeight(0);
      }
    }
  }, [createPointIsOpen, data?.campaignPointActive?.earningPointSegmented?.length]);

  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Create Point</p>

          <div>
            <Chip
              title={data?.isPointActive ? "Active" : "Inactive"}
              type={data?.isPointActive ? "success" : "neutral"}
            />
          </div>
        </div>

        <a
          className="cursor-pointer"
          onClick={() => {
            if (data?.isPointActive) {
              toggleCreatePoint();
            }
          }}
        >
          <CaretDownIcon
            className={`transform ${
              createPointIsOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300 ease-in-out`}
          />
        </a>
      </div>

      <p className="text-neutral300 text-sm font-normal border-b border-neutral40 pb-2">
        Enable this to allow Customers to earn points while the campaign is active.
      </p>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <PointProcessingSection pointProcessingMethod={data?.campaignPointActive?.pointProcessing} />
        <ParameterSection parameters={data?.campaignPointActive?.pointParameters} />
        <EarningPointSection
          method={data?.campaignPointActive?.earningPointMethod}
          segments={data?.campaignPointActive?.earningPointSegmented}
          pointEarned={data?.campaignPointActive?.earningPointAll?.pointEarned}
          pointEarnedException={data?.campaignPointActive?.earningPointAll?.pointEarnedException}
          tiers={tiers}
        />
        <PointMultiplierAndExpirationSection
          isPointMultiplied={data?.campaignPointActive?.isPointMultiplied}
          expirationDate={data?.campaignPointActive?.pointExpiration}
        />
        <PointEarnedNotificationSection
          isPointEarnedNotification={data?.campaignPointActive?.isPointEarnedNotification}
          emailTemplate={data?.campaignPointActive?.pointEarnedNotification?.emailTemplate}
          senderName={data?.campaignPointActive?.pointEarnedNotification?.senderName}
          smsTemplate={data?.campaignPointActive?.pointEarnedNotification?.smsTemplate}
          subject={data?.campaignPointActive?.pointEarnedNotification?.subject}
          templateLanguage={data?.campaignPointActive?.pointEarnedNotification?.templateLanguage}
          whatsappTemplate={data?.campaignPointActive?.pointEarnedNotification?.whatsappTemplate}
          channels={data?.campaignPointActive?.pointEarnedNotification?.channels}
          templates={templates}
        />
      </div>
    </div>
  );
};

export default CreatePointSection;
