import React from "react";
import jsonRequest from "../../../assets/images/json_request.png";
import { Info } from "@phosphor-icons/react";

const RedeemReward = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-medium">Redeem Reward</p>
        <div className="flex flex-col gap-2">
          <p>This API is used by customers to redeem a voucher that has already been generated.</p>
          <div
            className="p-4 rounded-md border-l-4 flex flex-col gap-2"
            style={{ background: "#eef9fd", borderColor: "#4cb3d4" }}
          >
            <div className="flex items-center gap-2">
              <Info size={24} />
              <p className="font-semibold">ENDPOINT</p>
            </div>
            <p>URL : {`https://{Base URL Send}/json/cgw`}</p>
            <p>Method : POST</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* LEFT: TABLE */}
        <div className="flex flex-col gap-2 flex-1" style={{ minWidth: 300 }}>
          <p className="text-lg font-medium mb-2">Description Parameter</p>

          {/* Horizontal scroll on small screens */}
          <div className="overflow-x-auto w-full">
            <table className="w-full">
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

              <tbody className="text-sm">
                <tr className="bg-white">
                  <td className="p-4">refID</td>
                  <td className="p-4">String(15)</td>
                  <td className="p-4">Fixed</td>
                  <td className="p-4">YES</td>
                  <td className="p-4">Alphanumeric</td>
                  <td className="p-4">A reference ID for the redemption. Required.</td>
                </tr>

                <tr className="bg-neutral20">
                  <td className="p-4">storeCode</td>
                  <td className="p-4">String(200)</td>
                  <td className="p-4">Max</td>
                  <td className="p-4">NO</td>
                  <td className="p-4">Alphanumeric</td>
                  <td className="p-4">The code of the store where the reward is being redeemed.</td>
                </tr>

                <tr className="bg-white">
                  <td className="p-4">customerID</td>
                  <td className="p-4">String(200)</td>
                  <td className="p-4">Max</td>
                  <td className="p-4">YES</td>
                  <td className="p-4">Alphanumeric</td>
                  <td className="p-4">The ID of the customer redeeming the reward.</td>
                </tr>

                <tr className="bg-neutral20">
                  <td className="p-4">rewardID</td>
                  <td className="p-4">String(36)</td>
                  <td className="p-4">Fixed</td>
                  <td className="p-4">YES</td>
                  <td className="p-4">UUID</td>
                  <td className="p-4">The ID of the reward being redeemed. Required.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2" style={{ minWidth: 258 }}>
          <p className="text-lg font-medium">JSON Request</p>

          <img
            alt="json-request-example"
            src={jsonRequest}
            className="w-full rounded-md object-contain"
            style={{ background: "#40444d" }}
          />
        </div>
      </div>
    </>
  );
};

export default RedeemReward;
