import React from "react";
import { XIcon, InfoIcon } from "@phosphor-icons/react";
import GeneratePointSection from "./GeneratePointSection";
import RedeemPointSection from "./RedeemPointSection";
import RedeemRewardSection from "./RedeemRewardSection";
import Modal from "prezent/Modal";

const PointProcessingDetailModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="max-w-6xl">
        <div className="flex justify-between py-3 px-6 border-b border-neutral40">
          <p className="font-semibold text-xl">Point Processing</p>

          <a className="cursor-pointer" onClick={onClose}>
            <XIcon size={24} />
          </a>
        </div>

        <div className="p-6">
          <p className="text-lg">
            This API manages point processing and ensures customers receive their points through the defined delivery
            method.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-6 py-4 bg-primary50">
          <div className="flex gap-2">
            <InfoIcon className="text-neutral80 -mt-0.5" size={24} />
            <div>
              <p className="font-semibold text-sm">API Access for Integration</p>
              <span className="text-sm">
                Easily integrate your system with our loyalty program using our available APIs. Check the full list of
                endpoints and technical guide on our{" "}
                <a
                  className="cursor-pointer hover:underline text-primary500 focus:outline-none"
                  href="https://api.sprintasia.co.id/"
                  target="_blank"
                >
                  Developer Page.
                </a>{" "}
                Use this Base URL to communicate with our system.{" "}
                <a className="no-underline font-semibold">https://api4.sandeza.id/json/cgw</a>
              </span>
            </div>
          </div>

          <GeneratePointSection />
          <RedeemPointSection />
          <RedeemRewardSection />
        </div>
      </div>
    </Modal>
  );
};

export default PointProcessingDetailModal;
