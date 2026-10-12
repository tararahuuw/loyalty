import React, { useRef } from "react";
import _ from "lodash";
import { XIcon, NotePencilIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import { PrimaryButton, OutlineButton, Chip } from "sprint-asia-custom-component";
import DangerButton from "./DangerButton";
import moment from "moment";
import SelectedRewardCard from "./SelectedRewardCard";
import BudgetCard from "./BudgetCard";
import RewardUtilizationCard from "./RewardUtilizationCard";
import RecipientListCard from "./RecipientListCard";
import RewardUtilizationSmallCard from "./RewardUtilizationSmallCard";
import GeneralEarningPointCard from "./GeneralEarningPointCard";
import EarningPointCard from "./EarningPointCard";
import Modal from "prezent/Modal";

const DraftModal = ({ formik, isOpen, onClose, onClickCancel, onClickSubmit, rewards = [], tiers, senderIds }) => {
  const headerRef = useRef(null);
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex justify-between py-3 px-6 border-b border-neutral40" ref={headerRef}>
        <p className="font-semibold text-xl">Campaign Preview</p>

        <a className="cursor-pointer" onClick={onClose}>
          <XIcon size={24} />
        </a>
      </div>

      <div className="p-4 bg-neutral20">
        <div className="flex flex-col bg-white p-4 rounded-md shadow-sm gap-4">
          <div className="flex items-center justify-between border-b border-neutral40 pb-2">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-medium">{formik.values.name}</p>
              <p className="font-normal text-sm">
                {moment(formik.values.startDate).format("DD MMM YYYY HH:mm")} -{" "}
                {moment(formik.values.endDate).format("DD MMM YYYY HH:mm")}
              </p>
            </div>
            <div>
              <Chip type="warning" title="Draft Campaign" />
            </div>
          </div>

          <p className="font-medium text-sm">{formik.values.description}</p>

          <div className="bg-neutral20 rounded-md p-4 flex flex-col gap-4">
            <p className="font-medium text-xl border-b border-neutral40 pb-2">
              {"Point" + " " + `${formik.values.isPointActive ? "" : "(Inactive)"}`}
            </p>

            {formik.values.isPointActive && (
              <div className="grid grid-cols-2 gap-2">
                {formik.values.pointProcessingMethod !== "upload point" && (
                  <GeneralEarningPointCard
                    pointEarned={formik.values.pointEarned}
                    pointEarnedException={formik.values.pointEarnedException}
                    parameters={formik.values.pointParameters}
                    method={formik.values.method}
                    segmentedCustomers={formik.values.segmentedCustomer}
                    tiers={tiers}
                  />
                )}

                <EarningPointCard
                  channels={formik.values.channels}
                  isPointEarnedNotification={formik.values.isPointEarnedNotification}
                  isPointMultiplier={formik.values.isPointMultiplier}
                  method={formik.values.method}
                  pointExpiration={formik.values.pointExpiration}
                  pointProcessingMethod={formik.values.pointProcessingMethod}
                  senderId={formik.values.senderID}
                  subject={formik.values.subject}
                  senderIds={senderIds}
                />
              </div>
            )}
          </div>

          <div className="bg-neutral20 rounded-md p-4 flex flex-col gap-4">
            <p className="font-medium text-xl border-b border-neutral40 pb-2">Rewards</p>

            <div className="grid grid-cols-5 gap-2">
              <SelectedRewardCard rewards={rewards} rewardUtilizationMethod={formik.values.rewardUtilizationMethod} />

              <div className="flex flex-col gap-2 col-span-2">
                <BudgetCard
                  recipients={formik.values.recipients}
                  rewards={rewards}
                  rewardUtilizationMethod={formik.values.rewardUtilizationMethod}
                  pointProcessingMethod={formik.values.pointProcessingMethod}
                />

                {(formik.values.rewardUtilizationMethod !== "dashboard" ||
                  formik.values.pointProcessingMethod === "upload point") && (
                  <RewardUtilizationSmallCard rewardUtilizationMethod={formik.values.rewardUtilizationMethod} />
                )}
              </div>

              {formik.values.rewardUtilizationMethod === "dashboard" &&
                formik.values.pointProcessingMethod !== "upload point" && (
                  <>
                    <RewardUtilizationCard
                      rewardUtilizationMethod={formik.values.rewardUtilizationMethod}
                      senderId={formik.values.senderID2}
                      subject={formik.values.subject2}
                      channels={formik.values.channels2}
                      rewardASssignmentMethod={formik.values.rewardAssignmentMethod}
                      senderIds={senderIds}
                    />

                    <RecipientListCard recipients={formik.values.recipients} channels={formik.values.channels2} />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end w-full p-4">
        <DangerButton variant="outlined" title="Cancel" onClick={onClickCancel} />
        <OutlineButton
          title={
            <div className="flex items-center gap-2">
              <NotePencilIcon />
              <p>Edit</p>
            </div>
          }
          onClick={onClose}
        />
        <PrimaryButton
          title={
            <div className="flex items-center gap-2">
              <FloppyDiskIcon />
              <p>Submit</p>
            </div>
          }
          onClick={onClickSubmit}
        />
      </div>
    </Modal>
  );
};

export default DraftModal;
