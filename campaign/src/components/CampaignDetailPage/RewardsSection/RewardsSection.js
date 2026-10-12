import React, { useEffect, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import RewardListSection from "./RewardListSection";
import { useDisclosure } from "prezent/useDisclosure";
import RewardUtilizationSection from "./RewardUtilizationSection";
import RewardDistributionNotificationSection from "./RewardDistributionNotificationSection";
import RewardAssigningMethodSection from "./RewardAssigningMethodSection";
import RecipientListSection from "./RecipientListSection";

const RewardsSection = ({ data, rewards, rewardUtilizationMethod, templates = [] }) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const { isOpen: rewardSIsOpen, toggle: toggleRewards } = useDisclosure(true);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (rewardSIsOpen) {
        setMaxHeight(contentRef.current.scrollHeight);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [rewardSIsOpen, data?.campaignPointInactive?.recipients?.length, rewardUtilizationMethod]);

  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Rewards</p>
        </div>

        <a className="cursor-pointer" onClick={toggleRewards}>
          <CaretDownIcon
            className={`transform ${
              rewardSIsOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300 ease-in-out`}
          />
        </a>
      </div>

      <p className="text-neutral300 text-sm font-normal border-b border-neutral40 pb-2">
        Engage Customers with rewards — given instantly or redeemed with active point.
      </p>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <RewardUtilizationSection rewardUtilizationMethod={data?.rewardUtilizationMethod} />
        <RewardListSection rewards={rewards} rewardUtilizationMethod={rewardUtilizationMethod} />
        {data?.rewardUtilizationMethod === "dashboard" ? (
          <>
            <RewardDistributionNotificationSection
              channels={data?.campaignPointInactive?.rewardDistributionNotification?.channels}
              emailTemplate={data?.campaignPointInactive?.rewardDistributionNotification?.emailTemplate}
              senderName={data?.campaignPointInactive?.rewardDistributionNotification?.senderName}
              smsTemplate={data?.campaignPointInactive?.rewardDistributionNotification?.smsTemplate}
              subject={data?.campaignPointInactive?.rewardDistributionNotification?.subject}
              templateLanguage={data?.campaignPointInactive?.rewardDistributionNotification?.templateLanguage}
              whatsappTemplate={data?.campaignPointInactive?.rewardDistributionNotification?.whatsappTemplate}
              templates={templates}
            />
            <RewardAssigningMethodSection
              rewardAssignmentMethod={data?.campaignPointInactive?.rewardAssignmentMethod}
            />
            <RecipientListSection
              templates={templates}
              recipients={data?.campaignPointInactive?.recipients}
              channels={data?.campaignPointInactive?.rewardDistributionNotification?.channels}
              data={data}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RewardsSection;
