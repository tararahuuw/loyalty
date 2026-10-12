import React from "react";
import { Square, CheckSquare } from "@phosphor-icons/react";

const CheckBox = ({ title, description, value, checked, onChange }) => {
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        value={value}
        id={title}
        checked={checked}
        className="self-start hidden"
        onChange={onChange}
      />
      <label htmlFor={title} className={`radio-label ${checked ? "checked" : ""} mt-0.5 cursor-pointer self-start`}>
        {checked ? <CheckSquare weight="fill" className="text-primary500" size={20} /> : <Square size={20} />}
      </label>

      <div className="flex flex-col">
        <p>{title}</p>
        <p className="text-neutral300 text-xs">{description}</p>
      </div>
    </div>
  );
};

export default CheckBox;
