import React from "react";
import ReactDOMServer from "react-dom/server";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { Info, X } from "@phosphor-icons/react";

const CustomDatePicker = ({
  isRequired,
  title,
  className,
  placeholder,
  isRange = true,
  onChangeRange,
  onChange,
  onReset,
  value = "",
  footer,
  mode,
  disabled,
  tooltip,
}) => {
  const startDate = value[0];
  const endDate = value[1];

  const handleChangeDate = (date) => {
    if (isRange) {
      const [start, end] = date;
      onChangeRange(start, end);
    } else {
      onChange(date);
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      <DatePicker
        showIcon
        calendarIconClassname="mt-1"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
          </svg>
        }
        disabled={disabled}
        selected={startDate}
        onChange={handleChangeDate}
        onKeyDown={(e) => e.preventDefault()}
        startDate={startDate}
        endDate={endDate}
        selectsRange={isRange}
        utcOffset={0}
        placeholderText={placeholder}
        dateFormat="d MMM yyyy"
        wrapperClassName="w-full"
        className={`${disabled ? "cursor-default" : "cursor-pointer"} py-1 border rounded-md w-fit h-10 flex 
              ${
                (!value[0] || !value[1]) &&
                mode === "default" &&
                "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"
              }
              ${
                (value[0] || value[1]) &&
                mode === "default" &&
                "bg-neutral20 border-black focus:outline-2 outline-primary500"
              }
              ${mode === "dashboard" && "bg-white border-neutral50 focus:outline-2 outline-primary500 text-neutral300"}
              ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
              ${mode === "disable" && "bg-neutral30 border-neutral50"}
            pl-10 w-full text-sm
            `}
      />

      <div className="flex items-center gap-2 absolute right-3 top-3 z-10">
        {!disabled && (value[0] || value[1]) && onReset && (
          <a className="cursor-pointer" onClick={onReset}>
            <X size={16} />
          </a>
        )}

        {tooltip && (
          <>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-place="top"
              data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                <div className="flex gap-1">
                  <div>
                    <Info className="text-white mt-0.5" size={16} />
                  </div>
                  <p className="text-white">{tooltip}</p>
                </div>
              )}
            >
              <Info className="text-danger500" />
            </a>

            <Tooltip
              id="my-tooltip"
              style={{ borderRadius: 8, background: "black", width: "320px", paddingTop: 16, paddingBottom: 16 }}
            />
          </>
        )}
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

export default CustomDatePicker;
