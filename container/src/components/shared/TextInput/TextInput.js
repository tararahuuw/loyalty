import React, { useState } from "react";
import { Info } from "@phosphor-icons/react";

const TextInput = ({
  title = "",
  rightComponent = null,
  leftIcon = null,
  rightIcon = null,
  placeholder = "",
  footer = null,
  mode = "default",
  isRequired = true,
  value,
  onChangeInput,
  className = "",
  rightAdornment,
  leftAdornment,
  type,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between w-full items-center">
        {title && (
          <div className="flex">
            <p className="text-sm font-normal text-black mb-1">{title}</p>
            {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
          </div>
        )}
        {rightComponent && <div>{rightComponent}</div>}
      </div>

      <div className="relative rounded-md">
        <section className="absolute inset-y-0 left-0 pl-2 flex items-center justify-center gap-2">
          {leftAdornment && leftAdornment}
          {leftIcon && (
            <Info
              size={16}
              className={`
                ${mode === "primary" && "text-black"}
                ${mode === "disable" && "text-neutral50"}
                ${mode === "danger" && "text-danger500"}
                `}
            />
          )}
        </section>

        <input
          className={`py-2.5 px-4 w-full font-normal text-sm text-neutral300 rounded-md border
                        ${
                          !value &&
                          mode === "default" &&
                          "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"
                        }
                        ${value && mode === "default" && "bg-neutral20 border-black focus:outline-2 outline-primary500"}
                        ${isFocused && mode === "default" && "bg-neutral20 border-primary500"}
                        ${mode === "disable" && "bg-neutral30 border-neutral50"}
                        ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
                        ${leftIcon || leftAdornment ? "pl-8" : "pl-3"}
                        ${leftIcon && leftAdornment ? "pl-16" : "pl-3"}
                        ${rightIcon || rightAdornment ? "pr-8" : "pr-3"}
                        ${rightIcon && rightAdornment ? "pr-16" : "pr-3"}`}
          placeholder={placeholder}
          data-mask="000.000.000-00"
          disabled={mode === "disable"}
          value={value}
          onChange={onChangeInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
        />

        <section className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center gap-2">
          {rightAdornment && rightAdornment}
          {rightIcon && (
            <Info
              size={16}
              className={`
                ${mode === "primary" && "text-black"}
                ${mode === "disable" && "text-neutral50"}
                ${mode === "danger" && "text-danger500"}
                `}
            />
          )}
        </section>
      </div>

      {footer && (
        <div className="mt-1">
          {mode === "danger" ? (
            <div className="flex">
              <div>
                <Info size={16} className="text-danger500" />
              </div>
              <p className="text-danger500 text-xs ml-1">{footer}</p>
            </div>
          ) : (
            <p className="text-black text-xs">{footer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInput;
