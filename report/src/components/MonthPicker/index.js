import React, { forwardRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { Info, CalendarBlank } from "@phosphor-icons/react";
import moment from "moment-timezone";

const CustomInput = forwardRef(
  ({ value, onClick, placeholder, isOpen }, ref) => {
    let displayValue = value;

    // Saat calendar terbuka → pakai "start -> end"
    if (isOpen && value.includes(" - ")) {
      displayValue = value.replace(" - ", " -> ");
    }

    // Saat calendar tertutup
    if (!isOpen && value.includes(" - ")) {
      const [start, end] = value.split(" - ");
      if (start === end || end === null || end === "") {
        displayValue = start; // kalau sama tampilkan satu
      } else {
        displayValue = `${start} -> ${end}`;
      }
    }

    return (
      <div
        onClick={onClick}
        ref={ref}
        className="border border-neutral300 rounded-md px-3 py-2 w-full cursor-pointer bg-white flex items-center gap-2"
        style={{ minWidth: "300px" }}
      >
        <CalendarBlank size={18} className="text-neutral300" />
        <span>{displayValue || placeholder}</span>
      </div>
    );
  }
);

const MonthPicker = ({
  title,
  isRequired,
  value,
  onChange,
  disabled,
  mode = "default",
  footer,
  className,
  placeholder,
  tooltip,
}) => {
  const [startDate, endDate] = value;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col w-full relative ${className || ""}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && (
            <p className="text-sm font-normal text-danger500 ml-1">*</p>
          )}
        </div>
      )}

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        placeholderText={placeholder || "Select month range"}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        customInput={
          <CustomInput placeholder={placeholder} isOpen={isOpen} />
        }
      />

      {tooltip && (
        <div className="absolute top-9 right-3">
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-place="top"
            data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
              <div className="flex gap-1">
                <Info className="text-white mt-0.5" size={16} />
                <p className="text-white">{tooltip}</p>
              </div>
            )}
          >
            <Info className="text-danger500" />
          </a>

          <Tooltip
            id="my-tooltip"
            style={{
              zIndex: 10,
              borderRadius: 8,
              background: "black",
              width: "320px",
              paddingTop: 16,
              paddingBottom: 16,
            }}
          />
        </div>
      )}

      {footer && (
        <div className="mt-1">
          {mode === "danger" ? (
            <div className="flex">
              <Info size={16} className="text-danger500" />
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

export default MonthPicker;
