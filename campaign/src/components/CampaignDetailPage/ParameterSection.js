import React, { useRef } from "react";
import { TextInput } from "sprint-asia-custom-component";
import ToolTip from "prezent/ToolTip";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import DropDownText from "../DropDownText/DropDownText";

const ParameterSection = ({ parameters = [] }) => {
  const parentRef = useRef();

  const formatNumber = (val) => {
    if (val === "" || val === null) return "";
    return new Intl.NumberFormat("id-ID").format(Number(val));
  };

  return (
    <div className="flex flex-col w-full bg-neutral20 rounded-lg p-6 gap-4">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold leading-6 text-left">Point Parameter</p>
        <ToolTip
          id="point-parameter"
          message="Configure parameters and rules that control how points are calculated and awarded to customers. These settings define eligibility, point values, and conditions for earning points."
        />
      </div>

      <div className="flex w-full flex-nowrap border border-neutral40 rounded-t-md overflow-x-auto">
        {parameters
          .sort((a, b) => a?.sequence - b?.sequence)
          .map((item, idx) => {
            const firstChild = idx === 0;
            const lastChild = idx === parameters.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col w-72 border-neutral40 ${
                  firstChild && parameters.length === 1 && "border-r"
                } ${firstChild ? "border-l-0" : lastChild ? "border-l border-r" : "border-l"}`}
                style={{ minWidth: 288 }}
              >
                <div className="bg-neutral30 border-neutral40 py-2 flex w-full">
                  <div className="flex px-2 w-full">
                    <p className="uppercase text-sm">{item.settingParameterName}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                  {item.settingParameterType === "datetime" ? (
                    <CustomDateTimePicker
                      parentRef={parentRef}
                      value={[
                        item.value.datetime.startDate,
                        item.value.datetime.endDate,
                        item.value.datetime.isEndDate,
                        item.value.datetime.isIncludeTime,
                      ]}
                      mode="disable"
                    />
                  ) : item.settingParameterType === "option" ? (
                    <DropDownText
                      parentRef={parentRef}
                      options={item.value.options?.map((item) => ({ option: item.label, value: item.value }))}
                      onSelect={() => {}}
                      itemName={item.settingParameterName}
                      title=""
                      currentOption={item.value?.options?.map((opt) => opt.value)}
                    />
                  ) : (
                    <TextInput
                      leftAdornment={
                        item.settingParameterName === "Transaction Amount (Rp)" ||
                        item.settingParameterName === "Total Saving (Rp)"
                          ? "Rp"
                          : ""
                      }
                      value={item.settingParameterType === "number" ? formatNumber(item.value.number) : item.value.text}
                      mode="disable"
                    />
                  )}

                  <div className="border border-dashed border-neutral80" />

                  <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                    <p>Exception</p>
                    {item.settingParameterType === "datetime" ? (
                      <CustomDateTimePicker
                        parentRef={parentRef}
                        value={[
                          item.exception.datetime?.startDate,
                          item.exception.datetime?.endDate,
                          item.exception.datetime?.isEndDate,
                          item.exception.datetime?.isIncludeTime,
                        ]}
                        placeholder="Not Selected"
                        mode="disable"
                      />
                    ) : item.settingParameterType === "option" ? (
                      <DropDownText
                        parentRef={parentRef}
                        options={
                          item.exception?.options?.map((item) => ({ option: item.label, value: item.value })) || []
                        }
                        onSelect={() => {}}
                        itemName={item.settingParameterName}
                        title=""
                        currentOption={item.exception?.options?.map((opt) => opt.value) || []}
                      />
                    ) : (
                      <TextInput
                        leftAdornment={
                          item.settingParameterName === "Transaction Amount (Rp)" ||
                          item.settingParameterName === "Total Saving (Rp)"
                            ? "Rp"
                            : item.settingParameterName === "Weight"
                            ? "Kg"
                            : ""
                        }
                        value={
                          item.settingParameterType === "number"
                            ? formatNumber(item.exception?.number)
                            : item.exception?.text
                        }
                        mode="disable"
                        placeholder="-"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ParameterSection;
