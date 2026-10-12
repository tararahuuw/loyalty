import React from "react";
import jsonRequest from "../../../../../assets/images/json_request.png";

const GeneratePointSection = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-medium">Generate Point</p>
        <div className="flex flex-col gap-2">
          <p>This API is used by customers to redeem a voucher that has already been generated.</p>
        </div>
      </div>

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
    </>
  );
};

export default GeneratePointSection;
