import React, { useRef, useState, useEffect } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { CaretDownIcon, InfoIcon } from "@phosphor-icons/react";
import RewardListSection from "./RewardListSection/RewardListSection";
import RewardDistributionSection from "./RewardDistributionSection/RewardDistributionSection";
import RecipientListSection from "./RewardDistributionSection/RecipientListSection";
import MessagePreviewSection from "./RewardDistributionSection/MessagePreviewSection";
import RewardDistributionNotificationSection from "./RewardDistributionSection/RewardDistributionNotificationSection";
import RewardAssignmentMethodSection from "./RewardDistributionSection/RewardAssignmentMethodSection";

const RewardsSection = ({
  allRewards = [],
  initialRewards = [],
  formik,
  companyId,
  balance,
  createPointIsChecked,
  pointProcessing,
  existingChannels = [],
  existingRecipients = [],
  openLoading,
  closeLoading,
  refetchVouchers,
  handleOpenModalResult,
  existingRewardUtil,
  templates,
  senderIds,
}) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const { isOpen: rewardSIsOpen, toggle: toggleRewards } = useDisclosure(true);
  const [channels, setChannels] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const error = formik.errors.recipients && formik.submitCount;

  useEffect(() => {
    if (initialRewards.length) {
      formik.setFieldValue(
        "rewards",
        initialRewards.map((reward) => ({
          id: reward.id,
          name: reward.name,
          type: reward.type,
          category: reward.category,
          price: reward.price,
          stock: reward.stock,
          pointNeeded: reward.pointNeeded,
          ownedQuantity: reward.ownedQuantity || reward.ownedQty,
          startDate: reward.startDate,
          endDate: reward.endDate,
          quantity: reward.quantity || 0,
          catalogId: reward.id,
        })),
      );
    }
  }, [initialRewards]);

  useEffect(() => {
    formik.setFieldValue(
      "channels2",
      channels.filter((channel) => channel !== "All"),
    );
  }, [channels]);

  useEffect(() => {
    // Dont reset recipients in edit page
    if (!existingRecipients.length) {
      formik.setFieldValue("recipients", []);
    }
    formik.setFieldValue(
      "rewards",
      initialRewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        type: reward.type,
        category: reward.category,
        price: reward.price,
        stock: reward.stock,
        pointNeeded: reward.pointNeeded,
        ownedQuantity:
          formik.values.rewardUtilizationMethod === "download"
            ? reward.actualOwnedQty || reward.ownedQty
            : reward.ownedQuantity || reward.ownedQty,
        startDate: reward.startDate,
        endDate: reward.endDate,
        quantity: reward.quantity || 0,
        catalogId: reward.id,
      })),
    );
  }, [formik.values.rewardAssignmentMethod, formik.values.rewardUtilizationMethod]);

  useEffect(() => {
    if (existingChannels.length) {
      setChannels(existingChannels);
    }
  }, [existingChannels]);

  useEffect(() => {
    if (!existingRewardUtil) formik.setFieldValue("rewardUtilizationMethod", "");
  }, [createPointIsChecked, existingRewardUtil]);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (rewardSIsOpen) {
        setMaxHeight(contentRef.current.scrollHeight);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [rewardSIsOpen, formik.values.rewardUtilizationMethod, formik.values.channels2, formik.values.recipients.length]);
  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="flex flex-col gap-2 text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p>Rewards</p>
          </div>

          <a className="cursor-pointer" onClick={toggleRewards}>
            <CaretDownIcon
              className={`transform ${
                rewardSIsOpen ? "rotate-180" : "rotate-0"
              } transition-transform duration-300 ease-in-out`}
            />
          </a>
        </div>

        <p className="text-neutral300 text-sm font-normal">
          Engage Customers with rewards — given instantly or redeemed with active point.
        </p>
      </div>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <RewardDistributionSection
          formik={formik}
          createPointIsChecked={createPointIsChecked}
          pointProcessing={pointProcessing}
        />
        <RewardListSection
          formik={formik}
          companyId={companyId}
          balance={balance}
          allRewards={allRewards}
          rewards={formik.values.rewards}
          rewardUtil={formik.values.rewardUtilizationMethod}
          recipients={formik.values.recipients}
          openLoading={openLoading}
          closeLoading={closeLoading}
          refetchVouchers={refetchVouchers}
          handleOpenModalResult={handleOpenModalResult}
        />

        {formik.values.rewardUtilizationMethod === "dashboard" && !createPointIsChecked && (
          <>
            <RewardDistributionNotificationSection
              formik={formik}
              templates={templates}
              channels={channels}
              senderIds={senderIds}
              setChannels={setChannels}
              setSelectedTemplateId={setSelectedTemplateId}
            />

            <RewardAssignmentMethodSection formik={formik} />

            <div className={`${error ? "bg-danger50" : "bg-neutral20"} rounded-lg p-6 flex flex-col gap-2`}>
              <p className="font-semibold text-lg">Recipient List</p>

              {typeof error === "string" ? (
                <div className="flex items-center gap-1">
                  <InfoIcon size={16} className="text-danger500" />
                  <p className="text-danger500 text-xs">{formik.errors.recipients}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-7 gap-2">
                <div className="col-span-5">
                  <RecipientListSection
                    formik={formik}
                    rewards={formik.values.rewards}
                    method={formik.values.rewardAssignmentMethod}
                    channels={channels}
                    recipients={formik.values.recipients}
                  />
                </div>

                <div className="col-span-2">
                  <MessagePreviewSection templates={templates} selectedTemplateId={selectedTemplateId} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RewardsSection;
