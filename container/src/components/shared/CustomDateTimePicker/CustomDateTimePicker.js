import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { useDisclosure } from "../../../hooks/useDisclosure";
import DatePicker from "react-datepicker";
import { CalendarBlank, Info, ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton, Switch } from "sprint-asia-custom-component";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateTimePicker = ({
  title = "",
  isRequired = true,
  value = [],
  onChange = () => {},
  mode = "default",
  footer = "",
  placeholder,
  disableToggles = false,
  isRange = true,
  className,
  isVisibleTime = true,
  minDate = undefined,
  maxDate = undefined,
  setIsOpen = () => {},
}) => {
  const apiTZ = "utc";
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateInitiated, setStartDateInitiated] = useState(false);
  const { isOpen, toggle, close } = useDisclosure(false);
  const {
    isOpen: isEndDate,
    toggle: toggleIsEndDate,
    open: enableIsEndDate,
    close: disableIsEndDate,
  } = useDisclosure(false);
  const {
    isOpen: isIncludeTime,
    toggle: toggleIsIncludeTime,
    open: enableIsIncludeTime,
    close: disableIsIncludeTime,
  } = useDisclosure(true);

  const handleSwitchRange = () => {
    toggleIsEndDate();
    setEndDate(null);
    setStartDateInitiated(false);
  };

  const [errorDate, setErrorDate] = useState(false);

  const CalendarContainer = ({ children }) => {
    return (
      <div className="p-4">
        <div className="relative">{children}</div>
      </div>
    );
  };

  const handleApply = () => {
    let updatedStartDate = startDate;
    let updatedEndDate = endDate;

    setErrorDate(false);
    if (isIncludeTime && startTime) {
      updatedStartDate = startDate ? startDate.replace(/T\d{2}:\d{2}(:\d{2})?(Z)?/, `T${startTime}`) : null;
    }
    if (isIncludeTime) {
      if (endTime && endDate) {
        updatedEndDate = endDate.replace(/T\d{2}:\d{2}(:\d{2})?(Z)?/, `T${endTime}`);
      } else if (endTime && !endDate) {
        updatedEndDate = null;
      }
    }
    if (isEndDate && !updatedEndDate) {
      setErrorDate(true);
      return;
    }
    if (isIncludeTime && updatedStartDate && updatedEndDate) {
      const start = moment(updatedStartDate);
      const end = moment(updatedEndDate);

      if (end.diff(start, "minutes") < 1) {
        setErrorDate(true);
        return;
      }
    }
    onChange(updatedStartDate, updatedEndDate, isEndDate, isIncludeTime);
    close();
  };

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const handleTimeChange = (e, time) => {
    let timeString = e.target.value;

    // Remove non-digit characters
    const raw = timeString.replace(/\D/g, "");

    // Normalize missing digits to "0"
    const paddedRaw = raw.padEnd(4, "0"); // ensures length 4 like "225" → "2250", "2" → "2000"

    let hours = paddedRaw.slice(0, 2);
    let minutes = paddedRaw.slice(2, 4);

    // Validate hours
    let h = parseInt(hours, 10);
    if (h > 23) h = 23;
    hours = h.toString().padStart(2, "0");

    // Validate minutes
    let m = parseInt(minutes, 10);
    if (m > 59) m = 59;
    minutes = m.toString().padStart(2, "0");

    // Final time string
    const correctedTime = `${hours}:${minutes}`;

    e.target.value = correctedTime;

    if (time === "start") {
      setStartTime(correctedTime);
    } else {
      setEndTime(correctedTime);
    }
    setErrorDate(false);
  };

  useEffect(() => {
    setStartTime("00:00");
    setEndTime("23:59");
  }, [isIncludeTime]);

  useEffect(() => {
    if (value[0]) {
      const apiTime = moment(value[0]).tz(apiTZ, true).format("YYYY-MM-DDTHH:mm");
      setStartDate(apiTime);
      if (value[3]) {
        setStartTime(moment(value[0]).format("HH:mm"));
      }
    } else {
      const apiTime = moment().startOf("day").tz(apiTZ, true).format("YYYY-MM-DDTHH:mm");
      setStartDate(apiTime);
    }
  }, [value[0], value[3]]);

  useEffect(() => {
    if (value[1]) {
      const apiTime = moment(value[1]).tz(apiTZ, true).format("YYYY-MM-DDTHH:mm");
      setEndDate(apiTime);
      if (value[3]) {
        setEndTime(moment(value[1]).format("HH:mm"));
      }
    }
  }, [value[1], value[3]]);

  useEffect(() => {
    if (value[2]) {
      enableIsEndDate();
    } else {
      disableIsEndDate();
    }
  }, [value[2]]);

  useEffect(() => {
    if (value[3]) {
      enableIsIncludeTime();
    } else {
      disableIsIncludeTime();
    }
  }, [value[3]]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current || !dropdownRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      dropdownRef.current.style.top = `${rect.bottom}px`;
      dropdownRef.current.style.left = `${rect.left}px`;
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Catch setIsOpen
  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {title && (
        <span className="text-sm font-normal text-black mb-1">
          {title}
          {isRequired && <span className="text-sm font-normal text-danger500 ml-1">*</span>}
        </span>
      )}
      <div
        className={`flex items-center gap-1 w-full py-2.5 px-4 font-normal text-sm text-neutral300 rounded-md
        ${mode === "danger" && "border border-danger500 bg-danger50"} 
        ${mode === "disable" ? "border bg-neutral30 border-neutral50 cursor-default" : "cursor-pointer"} 
        ${mode === "default" ? "border bg-neutral20 border-neutral40" : ""}
        ${mode === "filter" ? "border-none bg-white" : ""}
        overflow-hidden overflow-x-auto no-scrollbar-x`}
        ref={buttonRef}
        onClick={(e) => {
          if (mode !== "disable") {
            e.stopPropagation();
            toggle();
          }
        }}
      >
        <div className="flex items-center gap-1">
          <CalendarBlank />

          {value[0] ? (
            value[1] && moment.parseZone(value[0]).isSame(moment.parseZone(value[1])) ? (
              // ✅ kalau startDate == endDate
              <p className="whitespace-nowrap">
                {moment.parseZone(value[0]).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
              </p>
            ) : (
              // ✅ kalau beda
              <>
                <p className="whitespace-nowrap">
                  {moment.parseZone(value[0]).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
                </p>

                {value[1] && <ArrowRight />}

                {value[1] && (
                  <p className="whitespace-nowrap">
                    {moment.parseZone(value[1]).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
                  </p>
                )}
              </>
            )
          ) : (
            placeholder || "Select validity period"
          )}
        </div>
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

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`fixed z-50 border border-neutral50 rounded-lg bg-white shadow-lg flex flex-col ${
            isEndDate && "is-end-date"
          }`}
        >
          {/* Time Input Start Date */}
          {isIncludeTime && (
            <InputMask
              mask="99:99"
              className={`absolute right-20 pl-2 z-10 w-16 focus:outline-none ${
                errorDate ? "bg-danger50" : "bg-white"
              }`}
              style={{ top: 72 }}
              value={startTime}
              onChange={(e) => handleTimeChange(e, "start")}
            >
              {(inputProps) => (
                <div className="">
                  <input className="" {...inputProps} />
                </div>
              )}
            </InputMask>
          )}

          {/* Time Input End Date */}
          {isIncludeTime && isEndDate && (
            <InputMask
              mask="99:99"
              className={`absolute right-20 z-10 pl-2 w-16 focus:outline-none ${
                errorDate ? "bg-danger50" : "bg-white"
              }`}
              style={{ top: "115px" }}
              value={endTime}
              onChange={(e) => handleTimeChange(e, "end")}
            >
              {(inputProps) => (
                <div className="border-l border-neutral50">
                  <input className="" {...inputProps} />
                </div>
              )}
            </InputMask>
          )}

          {/* Start Date Picker */}
          {(!isEndDate || !startDateInitiated) && (
            <DatePicker
              placeholderText="Select validity period"
              selected={startDate && moment(startDate, "YYYY-MM-DDTHH:mm").toDate()}
              onChange={(date) => {
                const apiTimeFromPickerLocalDate = moment(date).format("YYYY-MM-DDTHH:mm");
                setStartDate(apiTimeFromPickerLocalDate);
                setErrorDate(false);
              }}
              startDate={startDate && moment(startDate, "YYYY-MM-DDTHH:mm").toDate()}
              endDate={endDate && moment(endDate, "YYYY-MM-DDTHH:mm").toDate()}
              selectsStart
              inline
              maxDate={maxDate}
              minDate={minDate}
              dateFormat={isIncludeTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy"}
              calendarContainer={CalendarContainer}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-white">
                    <CaretLeft
                      size={24}
                      color="#636364"
                      className={!prevMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={() => {
                        if (!prevMonthButtonDisabled) {
                          decreaseMonth();
                        }
                      }}
                    />

                    <p className="font-bold">
                      {moment(date).format("MMMM")} {moment(date).format("YYYY")}
                    </p>

                    <CaretRight
                      size={24}
                      color="#636364"
                      className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={() => {
                        if (!nextMonthButtonDisabled) {
                          increaseMonth();
                        }
                      }}
                    />
                  </div>

                  <div className={`flex flex-col items-center justify-between gap-1`}>
                    <div
                      className={`flex border rounded-lg ${
                        errorDate
                          ? "border-danger500 bg-danger50"
                          : startDateInitiated
                            ? "border-primary500 bg-white"
                            : "border-neutral50 bg-white"
                      } h-10 p-2 w-full cursor-pointer`}
                      style={{
                        outline: !startDateInitiated ? "2px solid #8baed4" : "none",
                      }}
                      onClick={() => setStartDateInitiated(false)}
                    >
                      <p
                        className={`text-left border-neutral50 ${
                          isIncludeTime ? "w-1/2 border-r" : "w-full"
                        } whitespace-nowrap`}
                      >
                        {startDate ? (
                          moment.utc(startDate).format("DD MMM YYYY")
                        ) : (
                          <span className="text-neutral80 text-sm">Select Start Date</span>
                        )}
                      </p>
                    </div>
                    {isEndDate && (
                      <>
                        <div
                          className={`flex border rounded-lg ${
                            errorDate
                              ? "border-danger500 bg-danger50"
                              : startDateInitiated
                                ? "border-primary500 bg-white"
                                : "border-neutral50 bg-white"
                          } h-10 p-2 w-full cursor-pointer`}
                          style={{
                            outline: startDateInitiated ? "2px solid #8baed4" : "none",
                          }}
                          onClick={() => setStartDateInitiated(true)}
                        >
                          <p
                            className={`text-left border-neutral50 ${
                              isIncludeTime ? "w-1/2 border-r" : "w-full"
                            } whitespace-nowrap`}
                          >
                            {endDate ? (
                              moment.utc(endDate).format("DD MMM YYYY")
                            ) : (
                              <span className="text-neutral80 text-sm">Select End Date</span>
                            )}
                          </p>
                        </div>
                      </>
                    )}
                    {errorDate === true && (
                      <div className="flex mt-1 w-full">
                        <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                        {endDate ? (
                          <p className="text-danger500 text-sm text-left">
                            End Time cannot be earlier<br></br>than Start Time.
                          </p>
                        ) : (
                          <p className="text-danger500 text-sm text-left">End date is required</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
          )}

          {/* End Date Picker */}
          {isEndDate && startDateInitiated && (
            <DatePicker
              placeholderText="Select validity period"
              selected={endDate && moment(endDate, "YYYY-MM-DDTHH:mm").toDate()}
              onChange={(date) => {
                const apiTimeFromPickerLocalDate = moment(date).format("YYYY-MM-DDTHH:mm");
                setEndDate(apiTimeFromPickerLocalDate);
                setErrorDate(false);
              }}
              startDate={startDate && moment(startDate, "YYYY-MM-DDTHH:mm").toDate()}
              endDate={endDate && moment(endDate, "YYYY-MM-DDTHH:mm").toDate()}
              selectsEnd
              minDate={startDate}
              maxDate={maxDate}
              inline
              dateFormat={isIncludeTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy"}
              calendarContainer={CalendarContainer}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <CaretLeft
                      size={24}
                      color="#636364"
                      className={!prevMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={() => {
                        if (!prevMonthButtonDisabled) {
                          decreaseMonth();
                        }
                      }}
                    />

                    <p className="font-bold">
                      {moment(date).format("MMMM")} {moment(date).format("YYYY")}
                    </p>

                    <CaretRight
                      size={24}
                      color="#636364"
                      className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={() => {
                        if (!nextMonthButtonDisabled) {
                          increaseMonth();
                        }
                      }}
                    />
                  </div>

                  <div className={`flex flex-col items-center justify-between gap-1`}>
                    <div
                      className={`flex border rounded-lg ${
                        errorDate
                          ? "border-danger500 bg-danger50"
                          : startDateInitiated
                            ? "border-primary500 bg-white"
                            : "border-neutral50 bg-white"
                      } h-10 p-2 w-full cursor-pointer`}
                      style={{
                        outline: !startDateInitiated ? "2px solid #8baed4" : "none",
                      }}
                      onClick={() => setStartDateInitiated(false)}
                    >
                      <p
                        className={`text-left border-neutral50 ${
                          isIncludeTime ? "w-1/2 border-r" : "w-full"
                        } whitespace-nowrap`}
                      >
                        {startDate ? (
                          moment.utc(startDate).format("DD MMM YYYY")
                        ) : (
                          <span className="text-neutral80 text-sm">Select Start Date</span>
                        )}
                      </p>
                    </div>
                    {isEndDate && (
                      <>
                        <div
                          className={`flex border rounded-lg ${
                            errorDate
                              ? "border-danger500 bg-danger50"
                              : startDateInitiated
                                ? "border-primary500 bg-white"
                                : "border-neutral50 bg-white"
                          } h-10 p-2 w-full cursor-pointer`}
                          style={{
                            outline: startDateInitiated ? "2px solid #8baed4" : "none",
                          }}
                          onClick={() => setStartDateInitiated(true)}
                        >
                          <p
                            className={`text-left border-neutral50 ${
                              isIncludeTime ? "w-1/2 border-r" : "w-full"
                            } whitespace-nowrap`}
                          >
                            {endDate ? (
                              moment.utc(endDate).format("DD MMM YYYY")
                            ) : (
                              <span className="text-neutral80 text-sm">Select End Date</span>
                            )}
                          </p>
                        </div>
                      </>
                    )}
                    {errorDate === true && (
                      <div className="flex mt-1 w-full">
                        <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                        {endDate ? (
                          <p className="text-danger500 text-sm text-left">
                            End Time cannot be earlier<br></br>than Start Time.
                          </p>
                        ) : (
                          <p className="text-danger500 text-sm text-left">End date is required</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            />
          )}

          <div className="flex flex-col gap-2 border-t border-b p-4 border-neutral50">
            {isRange && (
              <div className="flex items-center gap-2">
                {/* Switch to change single date to range date */}
                <Switch onChange={handleSwitchRange} checked={isEndDate} isEdit={disableToggles ? false : true} />
                <p>End Date</p>
              </div>
            )}

            {isVisibleTime && (
              <div className="flex items-center gap-2">
                {/* Switch to activate time picker */}
                <Switch onChange={toggleIsIncludeTime} checked={isIncludeTime} isEdit={disableToggles ? false : true} />
                <p>Include Time</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 p-4">
            <OutlineButton title="Cancel" type="full" onClick={toggle} />
            <PrimaryButton title="Apply" type="full" onClick={() => handleApply()} isActive={startDate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
