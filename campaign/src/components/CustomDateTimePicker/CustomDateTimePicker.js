import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { PiCalendarBlank, PiInfo } from "react-icons/pi";
import { RxArrowRight, RxChevronLeft, RxChevronRight } from "react-icons/rx";
import DatePicker from "react-datepicker";
import { OutlineButton, PrimaryButton, Switch } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import InputMask from "react-input-mask";
import "./CustomDateTimePicker.module.css";

const CustomDateTimePicker = ({
  title = "",
  isRequired = true,
  parentRef,
  value = [],
  onChange = () => {},
  mode = "",
  footer = "",
  placeholder,
  disableToggles = false,
}) => {
  const { timeZone: localTZ } = Intl.DateTimeFormat().resolvedOptions();
  const apiTZ = "utc";
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateInitiated, setStartDateInitiated] = useState(false);
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

    if (isIncludeTime && startTime) {
      updatedStartDate = startDate ? startDate.replace(/T\d{2}:\d{2}:\d{2}Z/, `T${startTime}:00Z`) : null;
    }

    if (isIncludeTime) {
      if (endTime && endDate) {
        updatedEndDate = endDate.replace(/T\d{2}:\d{2}:\d{2}Z/, `T${endTime}:00Z`);
      } else if (endTime && !endDate) {
        updatedEndDate = null;
      }
    }

    onChange(updatedStartDate, updatedEndDate, isEndDate, isIncludeTime);
    setIsOpen(false);
  };

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

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
  };

  useEffect(() => {
    setStartTime("00:00");
    setEndTime("00:00");
  }, [isIncludeTime]);

  useEffect(() => {
    if (value[0]) {
      const apiTime = moment(value[0]).tz(apiTZ, true).format("YYYY-MM-DDTHH:mm:ssZ");
      setStartDate(apiTime);
      if (value[3]) {
        setStartTime(moment(value[0]).format("HH:mm"));
      }
    }
  }, [value[0], value[3]]);

  useEffect(() => {
    if (value[1]) {
      const apiTime = moment(value[1]).tz(apiTZ, true).format("YYYY-MM-DDTHH:mm:ssZ");
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
    const updatePosition = () => {
      if (isOpen && buttonRef.current && dropdownRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        dropdownRef.current.style.top = `${rect.bottom + window.scrollY}px`;
        dropdownRef.current.style.left = `${rect.left + window.scrollX}px`;
      }
    };

    const handleScroll = () => {
      if (isOpen && parentRef.current) {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    parentRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      parentRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, parentRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {title && (
        <span className="text-sm font-normal text-black mb-1">
          {title}
          {isRequired && <span className="text-sm font-normal text-danger500 ml-1">*</span>}
        </span>
      )}

      <div
        className={`flex items-center gap-1 w-full py-2.5 px-4 font-normal text-sm text-neutral300 rounded-md border ${
          mode === "danger" && "border-danger500 bg-danger50"
        } ${
          mode === "disable"
            ? "bg-neutral30 border-neutral50 cursor-default"
            : "cursor-pointer bg-neutral20 border-neutral40"
        } overflow-hidden overflow-x-auto no-scrollbar-x`}
        ref={buttonRef}
        onClick={(e) => {
          if (mode !== "disable") {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-1">
          <PiCalendarBlank />

          {value[0] ? (
            <p className="whitespace-nowrap">
              {moment.parseZone(value[0]).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
            </p>
          ) : (
            placeholder || "Select validity period"
          )}

          {value[1] && <RxArrowRight />}

          {value[1] && (
            <p className="whitespace-nowrap">
              {moment.parseZone(value[1]).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
            </p>
          )}
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
              className="absolute top-16 right-20 z-10 w-16 focus:outline-none"
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
              className="absolute right-20 z-10 w-16 focus:outline-none"
              style={{ top: "110px" }}
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
              selected={startDate && moment(startDate).tz(apiTZ).tz(localTZ, true).toDate()}
              onChange={(date) => {
                const apiTimeFromPickerLocalDate = moment(date).tz(localTZ).tz(apiTZ, true).format();
                setStartDate(apiTimeFromPickerLocalDate);
              }}
              selectsStart
              startDate={startDate && moment(startDate).tz(apiTZ).tz(localTZ, true).toDate()}
              endDate={endDate && moment(endDate).tz(apiTZ).tz(localTZ, true).toDate()}
              inline
              dateFormat={isIncludeTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy"}
              //   showTimeSelect={isIncludeTime}
              //   timeIntervals={5}
              //   timeCaption="Time"
              //   timeFormat="HH:mm"
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
                    <RxChevronLeft
                      size={24}
                      color="#636364"
                      className={!prevMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={!prevMonthButtonDisabled && decreaseMonth}
                    />

                    <p className="font-bold">
                      {moment.utc(date).format("MMMM")} {moment.utc(date).format("YYYY")}
                    </p>

                    <RxChevronRight
                      size={24}
                      color="#636364"
                      className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={!nextMonthButtonDisabled && increaseMonth}
                    />
                  </div>

                  <div
                    className={`flex ${isEndDate && isIncludeTime && "flex-col"} items-center justify-between gap-1`}
                  >
                    <div
                      className={`flex border rounded-lg ${
                        !startDateInitiated ? "border-primary500" : "border-neutral50"
                      } h-10 p-2 ${isEndDate ? (isIncludeTime ? "w-full" : "w-28") : "w-full"} cursor-pointer`}
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
                        {startDate && moment.utc(startDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                    {isEndDate && (
                      <>
                        {isEndDate && isIncludeTime ? null : <p>-</p>}
                        <div
                          className={`flex border rounded-lg ${
                            startDateInitiated ? "border-primary500" : "border-neutral50"
                          } h-10 p-2 ${isIncludeTime ? "w-full" : "w-28"} cursor-pointer`}
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
                            {endDate && moment.utc(endDate).format("MMM D, YYYY")}
                          </p>
                        </div>
                      </>
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
              selected={endDate && moment(endDate).tz(apiTZ).tz(localTZ, true).toDate()}
              onChange={(date) => {
                const apiTimeFromPickerLocalDate = moment(date).tz(localTZ).tz(apiTZ, true).format();
                setEndDate(apiTimeFromPickerLocalDate);
              }}
              selectsEnd
              startDate={startDate && moment(startDate).tz(apiTZ).tz(localTZ, true).toDate()}
              endDate={endDate && moment(endDate).tz(apiTZ).tz(localTZ, true).toDate()}
              minDate={startDate}
              inline
              dateFormat={isIncludeTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy"}
              //   showTimeSelect={isIncludeTime}
              //   timeIntervals={5}
              //   timeCaption="Time"
              //   timeFormat="HH:mm"
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
                    <RxChevronLeft
                      size={24}
                      color="#636364"
                      className={!prevMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={!prevMonthButtonDisabled && decreaseMonth}
                    />

                    <p className="font-bold">
                      {moment.utc(date).format("MMMM")} {moment.utc(date).format("YYYY")}
                    </p>

                    <RxChevronRight
                      size={24}
                      color="#636364"
                      className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                      onClick={!nextMonthButtonDisabled && increaseMonth}
                    />
                  </div>

                  <div
                    className={`flex ${isEndDate && isIncludeTime && "flex-col"} items-center justify-between gap-1`}
                  >
                    <div
                      className={`flex border rounded-lg ${
                        !startDateInitiated ? "border-primary500" : "border-neutral50"
                      } h-10 p-2 ${isEndDate ? (isIncludeTime ? "w-full" : "w-28") : "w-full"} cursor-pointer`}
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
                        {startDate && moment.utc(startDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                    {isEndDate && (
                      <>
                        {isEndDate && isIncludeTime ? null : <p>-</p>}
                        <div
                          className={`flex border rounded-lg ${
                            startDateInitiated ? "border-primary500" : "border-neutral50"
                          } h-10 p-2 ${isIncludeTime ? "w-full" : "w-28"} cursor-pointer`}
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
                            {endDate && moment.utc(endDate).format("MMM D, YYYY")}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            />
          )}

          <div className="flex flex-col gap-2 border-t border-b p-4 border-neutral50">
            <div className="flex items-center gap-2">
              {/* Switch to change single date to range date */}
              <Switch onChange={handleSwitchRange} checked={isEndDate} isEdit={disableToggles ? false : true} />
              <p>End Date</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Switch to activate time picker */}
              <Switch onChange={toggleIsIncludeTime} checked={isIncludeTime} isEdit={disableToggles ? false : true} />
              <p>Include Time</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4">
            <OutlineButton title="Cancel" type="full" onClick={() => setIsOpen(!isOpen)} />
            <PrimaryButton title="Apply" type="full" onClick={handleApply} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
