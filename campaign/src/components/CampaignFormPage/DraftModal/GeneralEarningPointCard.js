import React from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import moment from "moment";

const GeneralEarningPointCard = ({
  pointEarned,
  pointEarnedException,
  parameters = [],
  method,
  segmentedCustomers = [],
  tiers = [],
}) => {
  const getTierName = (id) => {
    return tiers.filter((tier) => tier.id === id)[0]?.tierName;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-2 overflow-x-auto max-h-52">
        <div className="border-b border-neutral40 pb-2 grid grid-cols-3">
          <p className="font-medium text-base">General Earning Point</p>
          {method === "all" && (
            <div className="flex items-center gap-2 col-span-2">
              :<p className="font-medium text-sm">{pointEarned?.toLocaleString("id-ID")} points</p>
            </div>
          )}
        </div>

        {method === "segmented" && (
          <>
            <div className="grid grid-cols-3">
              <p className="font-medium text-sm">Apply for</p>
              <div className="flex items-center gap-2 col-span-2">
                :<p className="font-medium text-sm">Segmentation Customer</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-md bg-primary50 p-2">
              {segmentedCustomers.map((tier, idx) => (
                <div className="grid grid-cols-3" key={idx}>
                  <p className="font-medium text-sm">{getTierName(tier.tierLevelId)}</p>
                  <div className="flex items-center gap-2 col-span-2">
                    :<p className="font-medium text-sm">{tier.pointEarned}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {parameters.map((parameter) =>
          parameter.type === "datetime" ? (
            <div className="grid grid-cols-3" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.name}</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.value?.startDate && (
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-sm">
                      {moment(parameter.value.startDate).format(
                        parameter.value.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                      )}
                    </p>
                    {parameter.value.isEndDate && (
                      <>
                        <ArrowRightIcon size={20} />
                        <p className="font-medium text-sm">
                          {moment(parameter.value.endDate).format(
                            parameter.value.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.name}</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.type === "option" ? (
                  <p className="font-medium text-sm">
                    {parameter.value.options.length} {parameter.name} Selected
                  </p>
                ) : (
                  <p className="font-medium text-sm">
                    {parameter.type === "number"
                      ? parameter.name === "Transaction Amount (Rp)" || parameter.name === "Total Saving (Rp)"
                        ? `Rp ${Number(parameter.value.number).toLocaleString("id-ID")}`
                        : Number(parameter.value.number).toLocaleString("id-ID")
                      : parameter.value.text}
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 flex flex-col gap-2 overflow-x-auto max-h-52">
        <div className="border-b border-neutral40 pb-2 grid grid-cols-3">
          <p className="font-medium text-base">Special Conditions</p>
          {method === "all" && (
            <div className="flex items-center gap-2 col-span-2">
              :<p className="font-medium text-sm">{pointEarnedException?.toLocaleString("id-ID")} points</p>
            </div>
          )}
        </div>

        {method === "segmented" && (
          <div className="flex flex-col gap-2 rounded-md bg-primary50 p-2">
            {segmentedCustomers.map((tier, idx) => (
              <div className="grid grid-cols-3" key={idx}>
                <p className="font-medium text-sm">{getTierName(tier.tierLevelId)}</p>
                <div className="flex items-center gap-2 col-span-2">
                  :<p className="font-medium text-sm">{tier.pointEarnedException}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {parameters.map((parameter) => {
          const { type, exception } = parameter;

          // skip rendering if empty based on type
          if (
            (type === "option" && exception.options.length === 0) ||
            (type === "text" && !exception.text) ||
            (type === "number" && (exception.number === "" || exception.number === 0))
          ) {
            return null;
          }

          if (parameter.type === "datetime") {
            return (
              parameter.exception?.startDate && (
                <div className="grid grid-cols-3" key={parameter.id}>
                  <p className="font-medium text-sm">{parameter.name}</p>
                  <div className="flex items-center gap-2 col-span-2">
                    :
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm">
                        {moment(parameter.exception.startDate).format(
                          parameter.exception.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                        )}
                      </p>
                      {parameter.exception.isEndDate && (
                        <>
                          <ArrowRightIcon size={20} />
                          <p className="font-medium text-sm">
                            {moment(parameter.exception.endDate).format(
                              parameter.exception.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            );
          }

          return (
            <div className="grid grid-cols-3" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.name}</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.type === "option" ? (
                  <p className="font-medium text-sm">
                    {parameter.exception.options.length} {parameter.name} Selected
                  </p>
                ) : (
                  <p className="font-medium text-sm">
                    {parameter.type === "number"
                      ? parameter.name === "Transaction Amount (Rp)" || parameter.name === "Total Saving (Rp)"
                        ? `Rp ${Number(parameter.exception.number).toLocaleString("id-ID")}`
                        : Number(parameter.exception.number).toLocaleString("id-ID")
                      : parameter.exception.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralEarningPointCard;
