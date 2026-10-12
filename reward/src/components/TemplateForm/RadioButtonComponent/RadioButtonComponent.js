import React from "react";
import { RadioButton, Circle } from "@phosphor-icons/react";

const RadioButtonComponent = ({ onChange, checked, value, title, description, adornment }) => {
  return (
    <div className="flex flex-row gap-2 flex-1">
      <input
        type="radio"
        value={value}
        id={value}
        checked={checked}
        className="self-start hidden"
        onChange={onChange}
      />

      <label htmlFor={value} className={`radio-label ${checked ? "checked" : ""} mt-1`}>
        {checked ? <RadioButton weight="fill" className="text-primary500" /> : <Circle />}
      </label>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-base m-0">{title}</p>
        <p className="font-normal text-neutral300 text-xs m-0">{description}</p>
        {adornment}
      </div>
    </div>
  );
};

export default RadioButtonComponent;
