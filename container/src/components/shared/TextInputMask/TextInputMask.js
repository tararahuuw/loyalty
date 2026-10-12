import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Info } from "@phosphor-icons/react";

const TextInputMask = ({
  mask = "99.999.999.9-999.9999",
  onChange,
  value,
  className,
  title,
  isRequired,
  leftAdornment,
  leftIcon,
  rightAdornment,
  rightIcon,
  mode,
  footer,
  placeholder,
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
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      <InputMask mask={mask} value={value} onChange={onChange}>
        {(inputProps) => (
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
              {...inputProps}
              placeholder={placeholder}
              className={`py-2.5 px-4 w-full font-normal text-sm text-neutral300 rounded-md border
                ${!value && mode === "default" && "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"}
                ${value && mode === "default" && "bg-neutral20 border-black focus:outline-2 outline-primary500"}
                ${isFocused && mode === "default" && "bg-neutral20 border-primary500"}
                ${mode === "disable" && "bg-neutral30 border-neutral50"}
                ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
                ${leftIcon ? "pl-8" : "pl-3"}
                ${rightIcon ? "pr-8" : "pr-3"}`}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
        )}
      </InputMask>

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

export default TextInputMask;
