import React, { useState } from "react";
import { Info } from "@phosphor-icons/react";

const TextArea = ({
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
  lengthChecker = true,
  type,
  height,
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
        <span className="text-sm font-normal text-black mb-1">
          {title}
          {isRequired && <span className="text-sm font-normal text-danger500 ml-1">*</span>}
        </span>
      )}

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

        <textarea
          onChange={(e) => {
            let value = e.target.value;

            if (type === "number") {
              // If type is "number", sanitize the input to allow only numeric values
              value = value.replace(/[^0-9]/g, "");
            }

            onChange({ target: { value } }); // Pass the processed value to the parent handler
          }}
          placeholder={placeholder}
          className={`${
            height ? `h-${height}` : "h-24"
          } py-2.5 px-4 w-full font-normal text-sm text-neutral300 rounded-md border
                ${!value && mode === "default" && "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"}
                ${value && mode === "default" && "bg-neutral20 border-black focus:outline-2 outline-primary500"}
                ${isFocused && mode === "default" && "bg-neutral20 border-primary500"}
                ${mode === "disable" && "bg-neutral30 border-neutral50"}
                ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
                ${leftIcon ? "pl-8" : "pl-3"}
                ${rightIcon ? "pr-8" : "pr-3"}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
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

      <div className="mt-1 flex flex-row items-center justify-between">
        {footer &&
          (mode === "danger" ? (
            <div className="flex">
              <div>
                <Info size={16} className="text-danger500" />
              </div>
              <p className="text-danger500 text-xs ml-1">{footer}</p>
            </div>
          ) : (
            <p className="text-black text-xs">{footer}</p>
          ))}

        {lengthChecker && <p className="text-black text-xs">{value?.length || 0}/2000</p>}
      </div>
    </div>
  );
};

export default TextArea;
