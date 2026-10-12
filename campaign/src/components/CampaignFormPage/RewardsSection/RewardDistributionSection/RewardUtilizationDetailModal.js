import React from "react";
import { XIcon } from "@phosphor-icons/react";
import jsonRequest from "../../../../assets/images/json_request.png";
import Modal from "prezent/Modal";

const RewardUtilizationDetailModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="max-w-6xl">
        <div className="flex justify-between py-3 px-6 border-b border-neutral40">
          <p className="font-semibold text-xl">Reward Utilization</p>

          <a className="cursor-pointer" onClick={onClose}>
            <XIcon size={24} />
          </a>
        </div>

        <div className="p-4">
          <div className="flex flex-col gap-4 px-6 py-4 bg-primary50 rounded-md border border-neutral40">
            <p className="text-neutral500">
              This API is used to redeem a point utilization that has already been generated.
            </p>

            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <p className="text-lg font-medium">Description Parameter</p>
                <div className="overflow-auto max-w-full">
                  <table className="">
                    <thead className="bg-neutral40 text-neutral500 text-xs font-semibold text-left">
                      <tr className="border-t border-neutral40 uppercase">
                        <th className="p-4">Field</th>
                        <th className="p-4">Type Allowed</th>
                        <th className="p-4">Length Type</th>
                        <th className="p-4">Mandatory</th>
                        <th className="p-4">Format</th>
                        <th className="p-4">Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="bg-white">
                        <td className="p-4">refID</td>
                        <td className="p-4">String(15)</td>
                        <td className="p-4">Fixed</td>
                        <td className="p-4">YES</td>
                        <td className="p-4">Alphanumeric</td>
                        <td className="p-4">A reference ID for the redemption. Required.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium">Sample JSON Request</p>
                <img
                  alt="json-request-example"
                  className="rounded-md h-64 w-96"
                  style={{ background: "#40444d" }}
                  src={jsonRequest}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RewardUtilizationDetailModal;
