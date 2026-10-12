import React from "react";
import { RadioButtonIcon, CircleIcon } from "@phosphor-icons/react";

const RadioButtonComponent = ({ onChange, checked, value, title, description, adornment, disabled }) => {
  const id = crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

  return (
    <div className={`flex flex-row gap-2 flex-1 ${disabled ? "opacity-50" : "opacity-100"}`}>
      <input
        disabled={disabled}
        type="radio"
        value={value}
        id={id}
        checked={checked}
        className="self-start hidden"
        onChange={onChange}
      />

      <label htmlFor={id} className={`radio-label ${checked ? "checked" : ""} mt-1`}>
        {checked ? <RadioButtonIcon weight="fill" className="text-primary500" /> : <CircleIcon />}
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
