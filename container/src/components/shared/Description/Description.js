import React from "react";
import { PiArrowRight, PiCalendarBlank } from "react-icons/pi";

const Description = ({ 
  title, 
  value, 
  textColor = "default", 
  subtitle, 
  linkSubtitle, 
  onClickSubtitle, 
  image,
  icon
}) => {
  return (
    <div className="w-full min-w-0">
      {title && <p className="text-sm font-normal text-black">{title}</p>}
      {value && (
        <div className="whitespace-pre-line flex items-center">
          {
            icon && <div className="mr-2">{icon}</div>
          }
          <p
            className={`
              break-all whitespace-normal
            ${textColor == "default" && "text-black font-medium text-base"} 
            ${textColor == "success" && "text-success500 font-medium text-base"} 
            `}
          >
            {value}
          </p>
        </div>
      )}
      {subtitle && (
        <div className="flex items-center mt-1">
          <p className="text-sm font-normal text-black mr-1">{subtitle}</p>
          {linkSubtitle && (
            <p className="m-0 text-sm font-semibold text-primary500 cursor-pointer" onClick={onClickSubtitle}>
              {linkSubtitle}
            </p>
          )}
        </div>
      )}

      {image &&
        (typeof image === "string" ? (
          <img src={image} alt="voucher-img" className="w-52 h-52 object-contain rounded-lg mt-1" />
        ) : (
          <img
            src={URL.createObjectURL(image)}
            alt="voucher-img"
            className="w-52 h-52 object-contain rounded-lg mt-1"
          />
        ))}
    </div>
  );
};

export default Description;
