import React, { useRef } from "react";
import { MedalIcon } from "@phosphor-icons/react";
import DropDownText from "../../DropDownText/DropDownText";
import { TextInput } from "sprint-asia-custom-component";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";

const SampleTransactionForm = ({
  customerName,
  phoneNumber,
  email,
  earningPointMethod,
  parameters = [],
  calculatedPoints,
  isException,
  transactionDate,
  tierLevel,
}) => {
  const parentRef = useRef();
  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg py-5 px-6 shadow-md">
      <p className="font-medium text-xl border-b border-neutral40 pb-2">Sample Transaction Form</p>

      <div className="grid grid-cols-3 gap-4">
        <TextInput
          isRequired={false}
          title="Customer Name"
          mode="disable"
          value={customerName}
          onChangeInput={() => {}}
        />

        <TextInput
          isRequired={false}
          title="Phone Number"
          mode="disable"
          value={phoneNumber}
          onChangeInput={() => {}}
        />

        <TextInput isRequired={false} title="Email" mode="disable" value={email} onChangeInput={() => {}} />

        <CustomDateTimePicker
          title="Transaction Date"
          parentRef={parentRef}
          value={[transactionDate, null, false, true]}
          mode="disable"
        />

        {earningPointMethod === "segmented" && (
          <DropDownText
            isRequired={false}
            multiselect={false}
            title="Tier Level"
            parentRef={parentRef}
            options={[{ option: tierLevel, value: tierLevel }]}
            onSelect={() => {}}
            currentOption={[tierLevel]}
            mode="disable"
          />
        )}

        {parameters.map((parameter) => {
          if (parameter.type === "option") {
            if (parameter.name !== "Product") {
              return (
                <DropDownText
                  isRequired={false}
                  multiselect={false}
                  title={parameter.name}
                  parentRef={parentRef}
                  options={
                    parameter.name === "Store"
                      ? [{ option: parameter.value.label, value: parameter.value.label }]
                      : [{ option: parameter.value, value: parameter.value }]
                  }
                  onSelect={() => {}}
                  currentOption={parameter.name === "Store" ? [parameter.value.label] : [parameter.value]}
                  mode="disable"
                />
              );
            } else {
              return (
                <DropDownText
                  isRequired={false}
                  multiselect={true}
                  title={parameter.name}
                  parentRef={parentRef}
                  options={parameter.value.map((item) => ({ option: item, value: item }))}
                  onSelect={() => {}}
                  currentOption={parameter.value}
                  mode="disable"
                />
              );
            }
          }

          if (parameter.type === "number") {
            return (
              <TextInput
                isRequired={false}
                title={parameter.name}
                mode="disable"
                leftAdornment={
                  parameter.name === "Total Saving (Rp)" || parameter.name === "Transaction Amount (Rp)" ? (
                    <p className="text-xs pl-1">Rp</p>
                  ) : null
                }
                value={Number(parameter.value)?.toLocaleString("id-ID")}
                onChangeInput={() => {}}
              />
            );
          }

          if (parameter.type === "text") {
            return (
              <TextInput
                isRequired={false}
                title={parameter.name}
                mode="disable"
                value={parameter.value}
                onChangeInput={() => {}}
              />
            );
          }

          if (parameter.type === "datetime") return;
        })}
      </div>

      <div className="bg-primary50 flex justify-end rounded-md p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-10">
            <p className="italic text-neutral300 font-medium">Customer will earn</p>
            <p className="font-medium">{calculatedPoints?.toLocaleString("id-ID")} points</p>
          </div>

          {calculatedPoints ? (
            <div
              className={`self-end rounded-full px-4 py-1 flex items-center gap-2 ${
                isException ? "bg-success50 text-success500" : "bg-neutral20 text-neutral300"
              }`}
            >
              <MedalIcon />
              <p>{isException ? "Special Earning Point" : "General Earning Point"}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SampleTransactionForm;
