import React from "react";
import { PiChartLineUp, PiCoins } from "react-icons/pi";
import { Chip, OutlineButton } from "sprint-asia-custom-component";

const DetailPointConversion = ({ roleAccess, onClick, data }) => {
  const allowedRoles = ["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"];

  return (
    <div className="bg-white rounded-lg py-4 px-6 shadow-md">
      <div className="border rounded-md border-neutral40 p-4">
        <div className="flex items-center mb-4">
          <PiChartLineUp size="24" className="text-success500 mr-2" />
          <div>
            <p className="text-sm text-black font-medium">Basic Burning Rate</p>
            <p className="text-xs text-neutral300 mt-1">
              Set the base rate for point burning from customer transactions
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <p className="font-medium text-sm">Burning Rate (IDR per 1 point)</p>

          <p className="font-medium text-sm">1 point = Rp {data?.earningPointRate?.toLocaleString("id", "ID")}</p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-black font-medium">Minimum Transaction</p>

                  <div>
                    <Chip
                      title={data?.isMinimumTransaction ? "Active" : "Inactive"}
                      type={data?.isMinimumTransaction ? "success" : "danger"}
                    />
                  </div>
                </div>

                <p className="text-xs text-neutral300">Require a minimum transaction amount to burn points</p>

                {data?.isMinimumTransaction && (
                  <>
                    <p className="font-medium text-sm">Rp {(data?.minimumTransaction).toLocaleString("id", "ID")}</p>

                    <p className="text-xs text-neutral300 mt-1">
                      Customers must spend at least{" "}
                      <span className="font-semibold">
                        Rp {(data?.minimumTransaction).toLocaleString("id", "ID") || 0}
                      </span>{" "}
                      to burn points
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-black font-medium">Maximum Points per Transaction</p>

                  <div>
                    <Chip
                      title={data?.isMaximumPointTransaction ? "Active" : "Inactive"}
                      type={data?.isMaximumPointTransaction ? "success" : "danger"}
                    />
                  </div>
                </div>

                <p className="text-xs text-neutral300">
                  Limit the maximum points that can be burn in a single transaction
                </p>

                {data?.isMaximumPointTransaction && (
                  <>
                    <div className="flex items-center gap-2">
                      <PiCoins />

                      <p className="font-medium text-sm">
                        {(data?.maximumPointTransaction).toLocaleString("id", "ID")}
                      </p>
                    </div>

                    <p className="text-xs text-neutral300 mt-1">
                      Maximum{" "}
                      <span className="font-semibold">
                        {(data?.maximumPointTransaction).toLocaleString("id", "ID") || 0} points
                      </span>{" "}
                      can be burn per transaction
                      <br />
                      Equivalent to transactions above Rp{" "}
                      {(data?.maximumPointTransaction * data?.earningPointRate).toLocaleString("id", "ID")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {allowedRoles.includes(roleAccess) && (
        <div className="mt-6 flex justify-end">
          <OutlineButton title="Edit" className="px-6" onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export default DetailPointConversion;
