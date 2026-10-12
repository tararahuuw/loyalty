import React, { useRef } from "react";
import DropDownText from "../../DropDownText/DropDownText";
import moment from "moment";
import { ArrowRightIcon } from "@phosphor-icons/react";

const GeneralEarningPoint = ({
  method,
  pointEarned,
  pointEarnedException,
  segmentedCustomers = [],
  parameters = [],
}) => {
  const parentRef = useRef();
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white rounded-md shadow-md p-4 flex flex-col gap-2">
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
                  <p className="font-medium text-sm">{tier.tierLevelName}</p>
                  <div className="flex items-center gap-2 col-span-2">
                    :<p className="font-medium text-sm">{tier.pointEarned}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {parameters.map((parameter) =>
          parameter.settingParameterType === "datetime" ? (
            <div className="grid grid-cols-3" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.settingParameterName}</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.value?.datetime?.startDate && (
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-sm">
                      {moment(parameter.value.datetime.startDate).format(
                        parameter.value.datetime.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                      )}
                    </p>
                    {parameter.value.datetime.isEndDate && (
                      <>
                        <ArrowRightIcon size={20} />
                        <p className="font-medium text-sm">
                          {moment(parameter.value.datetime.endDate).format(
                            parameter.value.datetime.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 items-center" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.settingParameterName}</p>
              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.settingParameterType === "option" ? (
                  <DropDownText
                    parentRef={parentRef}
                    options={parameter.value.options?.map((item) => ({ option: item.label, value: item.value }))}
                    onSelect={() => {}}
                    itemName={parameter.settingParameterName}
                    title=""
                    currentOption={parameter.value?.options?.map((opt) => opt.value)}
                  />
                ) : (
                  <p className="font-medium text-sm">
                    {parameter.settingParameterType === "number"
                      ? parameter.settingParameterName === "Transaction Amount (Rp)" ||
                        parameter.settingParameterName === "Total Saving (Rp)"
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

      <div className="bg-white rounded-md shadow-md p-4 flex flex-col gap-2">
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
                <p className="font-medium text-sm">{tier.tierLevelName}</p>
                <div className="flex items-center gap-2 col-span-2">
                  :<p className="font-medium text-sm">{tier.pointEarnedException}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {parameters.map((parameter) => {
          const { settingParameterType, exception } = parameter;

          // skip rendering if empty based on settingParameterType
          if (
            (settingParameterType === "option" && (exception?.options?.length === 0 || !exception?.options)) ||
            (settingParameterType === "text" && !exception.text) ||
            (settingParameterType === "number" && (!exception.number || exception.number === 0))
          ) {
            return null;
          }

          if (parameter.settingParameterType === "datetime") {
            return (
              parameter.exception?.datetime?.startDate && (
                <div className="grid grid-cols-3" key={parameter.id}>
                  <p className="font-medium text-sm">{parameter.settingParameterName}</p>
                  <div className="flex items-center gap-2 col-span-2">
                    :
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm">
                        {moment(parameter.exception.datetime.startDate).format(
                          parameter.exception.datetime.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
                        )}
                      </p>
                      {parameter.exception.datetime.isEndDate && (
                        <>
                          <ArrowRightIcon size={20} />
                          <p className="font-medium text-sm">
                            {moment(parameter.exception.datetime.endDate).format(
                              parameter.exception.datetime.isIncludeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY"
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
            <div className="grid grid-cols-3 items-center" key={parameter.id}>
              <p className="font-medium text-sm">{parameter.settingParameterName}</p>

              <div className="flex items-center gap-2 col-span-2">
                :
                {parameter.settingParameterType === "option" ? (
                  <DropDownText
                    parentRef={parentRef}
                    options={parameter.exception.options?.map((item) => ({ option: item.label, value: item.value }))}
                    onSelect={() => {}}
                    itemName={parameter.settingParameterName}
                    title=""
                    currentOption={parameter.exception?.options?.map((opt) => opt.value)}
                  />
                ) : (
                  <p className="font-medium text-sm">
                    {parameter.settingParameterType === "number"
                      ? parameter.settingParameterName === "Transaction Amount (Rp)" ||
                        parameter.settingParameterName === "Total Saving (Rp)"
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

export default GeneralEarningPoint;
