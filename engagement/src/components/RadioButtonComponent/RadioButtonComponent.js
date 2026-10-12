import { Circle, RadioButton } from "@phosphor-icons/react";
import React from "react";

const RadioButtonComponent = ({
  onChange,
  checked,
  value,
  title,
  description,
  adornment,
  disable = false
}) => {
  return (
    <div
      className={`flex flex-row gap-2 flex-1 items-start ${
        disable ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      }`}
    >
      <input
        type="radio"
        value={value}
        id={value}
        checked={checked}
        disabled={disable}
        className="self-start hidden"
        onChange={onChange}
      />

      <label
        htmlFor={value}
        className={`radio-label ${checked ? "checked" : ""} mt-1`}
      >
        {checked ? (
          <RadioButton weight="fill" className="text-primary500" />
        ) : (
          <Circle />
        )}
      </label>

      <div className="flex flex-col">
        <p className="font-bold text-base m-0">{title}</p>
        <p className="font-normal text-neutral300 text-sm m-0">{description}</p>
        {adornment}
      </div>
    </div>
  );
};

export default RadioButtonComponent;