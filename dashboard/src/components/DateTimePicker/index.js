import React from "react";
import ReactDOMServer from "react-dom/server";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { Info } from "@phosphor-icons/react";

const DateTimePicker = ({
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
  minDate,
  defaultTime = "00:00",
}) => {
  const { timeZone: localTZ } = Intl.DateTimeFormat().resolvedOptions();
  const apiTZ = "utc";

  const handleDateChange = (date) => {
    const selectedMoment = moment(date).tz(localTZ);
    if (selectedMoment.format("HH:mm") === "00:00") {
      const [defaultHour, defaultMinute] = defaultTime.split(":");
      selectedMoment.hour(defaultHour).minute(defaultMinute);
    }
    const apiTimeFromPickerLocalDate = selectedMoment.tz(apiTZ, true).format();
    onChange(apiTimeFromPickerLocalDate);
  };

  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      <DatePicker
        disabled={disabled}
        showIcon
        calendarIconClassname="mt-1"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
          </svg>
        }
        selected={value && moment(value).tz(apiTZ).tz(localTZ, true).toDate()}
        placeholderText={placeholder}
        onChange={handleDateChange}
        minDate={minDate}
        utcOffset={-7}
        onKeyDown={(e) => e.preventDefault()}
        dateFormat="dd MMM yyyy HH:mm"
        showTimeInput
        className={`${disabled ? "cursor-not-allowed bg-neutral30" : "cursor-pointer"} border rounded-md text-neutral300 h-10 flex
          ${!value && mode === "default" && "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"}
          ${value && mode === "default" && "bg-neutral20 border-black focus:outline-2 outline-primary500"}
          ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
          ${mode === "disable" && "bg-neutral30 border-neutral50"} w-full text-sm
          `}
      />

      {tooltip && (
        <div className="absolute top-9 right-3">
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

export default DateTimePicker;