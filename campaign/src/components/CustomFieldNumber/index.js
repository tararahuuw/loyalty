import React from "react";
import { PiInfo } from "react-icons/pi";

const CustomFieldNumber = ({
    min,
    max,
    additionalWord,
    onClick,
    className = "",
    footer = null,
    mode = "default",
}) => {
  return (
    <div className={`w-full ${className}`} onClick={onClick}>
      <div className="relative rounded-md">
        <div className={`py-2.5 px-4 w-full cursor-pointer font-normal text-sm ${mode === "danger" ? "text-neutral300 bg-danger50 border-danger500" : min === "" ? "text-neutral300 bg-neutral20 border-neutral300" : "text-neutral300 bg-neutral20 border-black"} rounded-md border`}>
          {
            min === null && max === null ?
            <p>Please input value</p>
            :
            <p>
              {
                max !== null ?
                <span>Min{additionalWord} {min ? min.toLocaleString() : null} - Max{additionalWord} {max.toLocaleString()}</span>
                :
                <span>Minimum{additionalWord} {min ? min.toLocaleString() : null}</span>
              }
            </p>
          }
        </div>
      </div>
      {footer && (
        <div className="mt-1">
          {mode === "danger" ? (
            <div className="flex">
              <div>
                <PiInfo size={16} className="text-danger500" />
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

export default CustomFieldNumber;
