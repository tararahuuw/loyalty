import React from "react";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";
import ToolTip from "prezent/ToolTip";
import { useDisclosure } from "prezent/useDisclosure";
import RewardUtilizationDetailModal from "./RewardUtilizationDetailModal";
import { InfoIcon } from "@phosphor-icons/react";

const RewardDistributionSection = ({ formik, createPointIsChecked, pointProcessing }) => {
  const { isOpen, toggle } = useDisclosure();

  const isError = formik.submitCount && formik.errors.rewardUtilizationMethod;
  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Utilization</p>
          <ToolTip
            id="reward-utilization"
            message="Choose how rewards will be delivered, redeemed, and tracked after processing. This option defines how rewards are made available to Customers and how their usage is managed within the loyalty program"
          />
        </div>

        {isError ? (
          <div className="flex items-center text-danger500 gap-1">
            <InfoIcon />
            <p className="text-sm">Please select one Reward Utilization option to continue.</p>
          </div>
        ) : null}

        <div
          className={`rounded-lg flex justify-between gap-8 p-4 ${
            isError ? "border border-danger500 bg-danger50" : "bg-white"
          }`}
        >
          <RadioButtonComponent
            onChange={() => formik.setFieldValue("rewardUtilizationMethod", "api")}
            checked={formik.values.rewardUtilizationMethod === "api"}
            value="api"
            title="API"
            description={
              <span>
                Reward is delivered or redeemed through system integration, allowing external systems or partners to
                automatically trigger reward processes.{" "}
                <span className="text-primary500 hover:underline cursor-pointer" onClick={toggle}>
                  Click here
                </span>{" "}
                for more details.
              </span>
            }
            disabled={pointProcessing === "upload point"}
          />

          {createPointIsChecked && (
            <RadioButtonComponent
              onChange={() => formik.setFieldValue("rewardUtilizationMethod", "pwa")}
              checked={formik.values.rewardUtilizationMethod === "pwa"}
              value="pwa"
              title="PWA"
              description={
                <span>
                  Reward is accessed and redeemed directly by Customers through the Progressive Web App (PWA), enabling
                  self-service redemption.
                </span>
              }
            />
          )}

          <RadioButtonComponent
            onChange={() => formik.setFieldValue("rewardUtilizationMethod", "dashboard")}
            checked={formik.values.rewardUtilizationMethod === "dashboard"}
            value="dashboard"
            title="Dashboard"
            disabled={createPointIsChecked && pointProcessing !== "upload point"}
            description={
              <span>
                Reward is managed through the{" "}
                <a
                  className="text-primary500 hover:underline cursor-pointer"
                  href={`${window.location.origin}/prezent/loyalty-setting/engagement/customer/tier-level`}
                  target="_blank"
                >
                  Customer 360
                </a>{" "}
                menu when points are active, or sent to selected Customers via messaging channels when points are
                inactive.
              </span>
            }
          />

          {createPointIsChecked ? null : (
            <RadioButtonComponent
              onChange={() => formik.setFieldValue("rewardUtilizationMethod", "download")}
              checked={formik.values.rewardUtilizationMethod === "download"}
              value="download"
              title="Download"
              description="Reward is provided in downloadable files (e.g., CSV, Excel, PDF) for offline distribution or import into other systems."
            />
          )}

          {createPointIsChecked && (
            <RadioButtonComponent
              onChange={() => formik.setFieldValue("rewardUtilizationMethod", "download point")}
              checked={formik.values.rewardUtilizationMethod === "download point"}
              value="download point"
              title="Download Point"
              description={
                <span>
                  Rewards are provided outside the system, and points generated from the campaign can be downloaded from{" "}
                  <a
                    className="text-primary500 cursor-pointer hover:underline"
                    href={`${window.location.origin}/prezent/loyalty-setting/engagement/customer/points`}
                    target="_blank"
                  >
                    {" "}
                    the Customer 360 menu.
                  </a>
                </span>
              }
            />
          )}
        </div>
      </div>

      <RewardUtilizationDetailModal isOpen={isOpen} onClose={toggle} />
    </div>
  );
};

export default RewardDistributionSection;
