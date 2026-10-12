import React, { useState, useEffect, useRef } from "react";
import {
    MagnifyingGlass,
    Calendar,
    Funnel,
    CaretDown,
    CaretUp,
} from "@phosphor-icons/react";
import InputMask from "react-input-mask";
import { OutlineButton, PrimaryButton, Switch } from "sprint-asia-custom-component";
import { Info, CaretLeft, CaretRight } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import { useDisclosure } from "prezent/useDisclosure";

function FilterDropdownMixed({ parentRef, filterOptions, currentData, setCurrentData, isRange = true, disableToggles = false }) {
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
    const [open, setOpen] = useState(false);
    const [openOption, setOpenOption] = useState(false);
    const [errorDate, setErrorDate] = useState(false)

    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
                setOpenOption(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let value = currentData[selectedFilter.id] || null;
    if (selectedFilter.type === "checkbox" && !Array.isArray(value)) {
        value = [];
    }

    const updateValue = (val) => {
        setCurrentData({
            ...currentData,
            [selectedFilter.id]: val,
        });
    };

    const [tempValue, setTempValue] = useState(value || "");

    useEffect(() => {
        setTempValue(value || "");
    }, [selectedFilter, value]);

    useEffect(() => {
        if (selectedFilter.type === "string") {
            const handler = setTimeout(() => {
                updateValue(tempValue);
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [tempValue, selectedFilter]);

    const renderIcon = () => {
        if (selectedFilter.type === "string") return <MagnifyingGlass size={18} />;
        if (selectedFilter.type === "date") return <Calendar size={18} />;
        if (selectedFilter.type === "dropdown" || selectedFilter.type === "checkbox" || selectedFilter.type === "radiobutton") return null;
        if (selectedFilter.type === "checkbox" || selectedFilter.type === "radiobutton")
            return <Funnel size={18} />;
        return null;
    };

    const getPlaceholder = () => {
        if (selectedFilter.type === "string")
            return `Search ${selectedFilter.label}`;
        if (selectedFilter.type === "date") return `Select ${selectedFilter.label}`;
        if (selectedFilter.type === "checkbox" || selectedFilter.type === "radiobutton" || selectedFilter.type === "dropdown")
            return `Choose ${selectedFilter.label}`;
        return "";
    };

    // Date Section
    const { timeZone: localTZ } = Intl.DateTimeFormat().resolvedOptions();
    const apiTZ = "utc";
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(moment().startOf("day").tz(apiTZ, true).format("YYYY-MM-DDTHH:mm"));
    const [endDate, setEndDate] = useState(null);
    const [startDateInitiated, setStartDateInitiated] = useState(false);
    const { isOpen: isEndDate, toggle: toggleIsEndDate } = useDisclosure(false);
    const {
        isOpen: isIncludeTime,
        toggle: toggleIsIncludeTime,
    } = useDisclosure(false);

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

        setErrorDate(false);

        if (isIncludeTime && startTime) {
            updatedStartDate = startDate
                ? startDate.replace(/T\d{2}:\d{2}(:\d{2})?(Z)?/, `T${startTime}`)
                : null;
        }

        if (isIncludeTime) {
            if (endTime && endDate) {
                updatedEndDate = endDate.replace(
                    /T\d{2}:\d{2}(:\d{2})?(Z)?/,
                    `T${endTime}`
                );
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

        // 🔹 kalau ga include time → hapus THH:mm di akhir string
        if (!isIncludeTime) {
            if (updatedStartDate) {
                updatedStartDate = updatedStartDate.replace(/T\d{2}:\d{2}$/, "");
            }
            if (updatedEndDate) {
                updatedEndDate = updatedEndDate.replace(/T\d{2}:\d{2}$/, "");
            }
        }
        updateValue({ startDate: updatedStartDate, endDate: updatedEndDate });
        setOpenOption(false);
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
    };

    useEffect(() => {
        setStartTime("00:00");
        setEndTime("23:59");
    }, [isIncludeTime]);

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
        <div
            ref={wrapperRef}
            className="flex items-center border border-neutral80 rounded-lg px-3 py-2 space-x-3 w-full max-w-xl text-neutral300 bg-neutral20"
        >
            {/* Dropdown kiri */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => {
                        setOpen(!open)
                        setOpenOption(false)
                    }}
                    className="flex justify-between items-center gap-1 font-semibold text-sm"
                    style={{ width: "150px" }}
                >
                    <p className="truncate">{selectedFilter.label}</p>
                    {open ? (
                        <CaretUp size={14} className="ml-2 flex-shrink-0" />
                    ) : (
                        <CaretDown size={14} className="ml-2 flex-shrink-0" />
                    )}
                </button>

                {open && filterOptions?.length > 0 && (
                    <ul
                        className="-ml-3 absolute z-10 mt-4 max-h-48 overflow-y-auto rounded-lg border border-neutral80 bg-white shadow"
                        style={{ width: "180px" }}
                    >
                        {filterOptions.map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => {
                                    setSelectedFilter(opt);
                                    setOpen(false);
                                }}
                                className="px-2 py-1 cursor-pointer bg-white text-sm rounded-lg"
                            >
                                <p className="hover:bg-neutral20 rounded-lg p-2 w-full truncate">
                                    {opt.label}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <span className="border-l border-neutral80 h-6" />

            {/* Input kanan + ikon */}
            <div className="flex-1 flex items-center gap-2">
                <span className="text-neutral500">{renderIcon()}</span>

                {selectedFilter.type === "string" && (
                    <input
                        type="text"
                        placeholder={getPlaceholder()}
                        value={tempValue || ""}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="outline-none w-full text-sm bg-neutral20 text-black"
                        style={{ width: "250px" }}
                    />
                )}

                {/* 🔹 Checkbox */}
                {selectedFilter.type === "checkbox" && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenOption(!openOption)
                                setOpen(false)
                            }}
                            className="flex items-center text-sm"
                            style={{ minWidth: "250px" }}
                        >
                            <div className="w-full flex items-center justify-between text-black">
                                <span className="text-sm text-neutral300 truncate">
                                    {value.length === 0 ? getPlaceholder() : value.length === 1 ? value[0].label : `${value.length} Selected`}
                                </span>
                                {openOption ? (
                                    <CaretUp size={14} className="ml-2 flex-shrink-0" />
                                ) : (
                                    <CaretDown size={14} className="ml-2 flex-shrink-0" />
                                )}
                            </div>
                        </button>

                        {selectedFilter.options && openOption && (
                            <ul className="-ml-4 absolute z-10 mt-4 w-56 max-h-60 overflow-y-auto rounded-md border border-neutral80 bg-white shadow p-2">
                                {/* Select All */}
                                <label className="flex items-center gap-1 py-1 px-2 w-full hover:bg-neutral20 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={value?.length === selectedFilter.options.length}
                                        indeterminate={
                                            value?.length > 0 &&
                                            value?.length < selectedFilter.options.length
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                updateValue([...selectedFilter.options]); // all objects
                                            } else {
                                                updateValue([]);
                                            }
                                        }}
                                    />
                                    <p className="text-sm rounded-lg p-1">Select All</p>
                                </label>

                                {/* Item list */}
                                {selectedFilter.options.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className="flex items-center gap-1 py-1 px-2 w-full hover:bg-neutral20 rounded-lg"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={value?.some((v) => v.value === opt.value) || false}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    updateValue([...(value || []), opt]);
                                                } else {
                                                    updateValue(value.filter((v) => v.value !== opt.value));
                                                }
                                            }}
                                        />
                                        <p className="text-sm rounded-lg p-1">{opt.label}</p>
                                    </label>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* 🔹 Dropdown */}
                {selectedFilter.type === "dropdown" && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenOption(!openOption)
                                setOpen(false)
                            }}
                            className="flex items-center text-sm"
                            style={{ width: "250px" }}
                        >
                            <div className="w-full flex items-center justify-between text-black">
                                <span className="text-sm text-neutral300 truncate">
                                    {value.length === 0 ? getPlaceholder() : value.label}
                                </span>
                                {openOption ? (
                                    <CaretUp size={14} className="ml-2 flex-shrink-0" />
                                ) : (
                                    <CaretDown size={14} className="ml-2 flex-shrink-0" />
                                )}
                            </div>
                        </button>

                        {selectedFilter.options && openOption && (
                            <ul className="-ml-4 absolute z-10 mt-4 w-72 max-h-48 overflow-y-auto rounded-md border border-neutral80 bg-white shadow p-2">
                                {selectedFilter.options.map((opt) => (
                                    <label
                                        key={opt.value}
                                        onClick={() => {
                                            updateValue(opt)
                                            setOpenOption(false)
                                        }}
                                        className="flex items-center gap-1 py-1 px-2 w-full hover:bg-neutral20 rounded-lg"
                                    >
                                        <p className="text-sm rounded-lg p-1">{opt.label}</p>
                                    </label>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {/* 🔹 Radio */}
                {selectedFilter.type === "radiobutton" && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenOption(!openOption)
                                setOpen(false)
                            }}
                            className="flex items-center text-sm"
                            style={{ width: "250px" }}
                        >
                            <div className="w-full flex items-center justify-between text-black">
                                <span className="text-sm text-neutral300 truncate">
                                    {value ? value.label : getPlaceholder()}
                                </span>
                                {openOption ? (
                                    <CaretUp size={14} className="ml-2 flex-shrink-0" />
                                ) : (
                                    <CaretDown size={14} className="ml-2 flex-shrink-0" />
                                )}
                            </div>
                        </button>

                        {selectedFilter.options && openOption && (
                            <ul className="-ml-4 absolute z-10 mt-4 w-72 max-h-48 overflow-y-auto rounded-md border border-neutral80 bg-white shadow p-2">
                                {selectedFilter.options.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className="flex items-center gap-1 py-1 px-2 w-full hover:bg-neutral20 rounded-lg"
                                    >
                                        <input
                                            type="radio"
                                            name={selectedFilter.id}
                                            checked={value?.value === opt.value}
                                            onChange={() => updateValue(opt)}
                                        />
                                        <p className="text-sm rounded-lg p-1">{opt.label}</p>
                                    </label>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {selectedFilter.type === "date" && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenOption(!openOption)
                                setOpen(false)
                            }}
                            className="flex items-center text-sm"
                            style={{ width: "250px" }}
                        >
                            <span className="text-sm text-neutral300 truncate">
                                {
                                    // 1. Jika startDate & endDate null → getPlaceholder
                                    (!value?.startDate && !value?.endDate) ? getPlaceholder()
                                        : (
                                            // 2. Kalau isEndDate false → hanya startDate
                                            !isEndDate
                                                ? (value?.startDate
                                                    ? moment(value.startDate.replace("Z", "")).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")
                                                    : getPlaceholder())
                                                : (
                                                    // 3. Kalau isEndDate true
                                                    (value?.startDate && value?.endDate)
                                                        ? (
                                                            // 3a. Kalau startDate === endDate → render startDate aja
                                                            value.startDate === value.endDate
                                                                ? moment(value.startDate.replace("Z", "")).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")
                                                                : `${moment(value.startDate.replace("Z", "")).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")} - ${moment(value.endDate.replace("Z", "")).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}`
                                                        )
                                                        : (
                                                            value?.endDate
                                                                ? moment(value.endDate.replace("Z", "")).format(isIncludeTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")
                                                                : getPlaceholder()
                                                        )
                                                )
                                        )
                                }
                            </span>
                        </button>

                        {openOption && (
                            <div
                                ref={dropdownRef}
                                className={`-ml-6 mt-4 fixed z-50 border border-neutral50 rounded-lg bg-white shadow-lg flex flex-col ${isEndDate && "is-end-date"
                                    }`}
                            >
                                {/* Time Input Start Date */}
                                {isIncludeTime && (
                                    <InputMask
                                        mask="99:99"
                                        className={`absolute top-16 right-20 pl-2 z-10 w-16 focus:outline-none ${errorDate ? "bg-danger50" : "bg-white"}`}
                                        value={startTime}
                                        onChange={(e) => {
                                            handleTimeChange(e, "start")
                                            setErrorDate(false)
                                        }}
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
                                        className={`absolute right-20 z-10 pl-2 w-16 focus:outline-none ${errorDate ? "bg-danger50" : "bg-white"}`}
                                        style={{ top: "110px" }}
                                        value={endTime}
                                        onChange={(e) => {
                                            handleTimeChange(e, "end")
                                            setErrorDate(false)
                                        }}
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
                                            setErrorDate(false)
                                        }}
                                        startDate={startDate && moment(startDate, "YYYY-MM-DDTHH:mm").toDate()}
                                        endDate={endDate && moment(endDate, "YYYY-MM-DDTHH:mm").toDate()}
                                        selectsStart
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
                                                <div className="flex items-center justify-between bg-white">
                                                    <CaretLeft
                                                        size={24}
                                                        color="#636364"
                                                        className={!prevMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                                                        onClick={!prevMonthButtonDisabled && decreaseMonth}
                                                    />

                                                    <p className="font-bold">
                                                        {moment.utc(date).format("MMMM")} {moment.utc(date).format("YYYY")}
                                                    </p>

                                                    <CaretRight
                                                        size={24}
                                                        color="#636364"
                                                        className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                                                        onClick={!nextMonthButtonDisabled && increaseMonth}
                                                    />
                                                </div>

                                                <div
                                                    className={`flex flex-col items-center justify-between gap-1`}
                                                >
                                                    <div
                                                        className={`flex border rounded-lg ${errorDate ? "border-danger500 bg-danger50" : startDateInitiated ? "border-primary500 bg-white" : "border-neutral50 bg-white"
                                                            } h-10 p-2 w-full cursor-pointer`}
                                                        style={{
                                                            outline: !startDateInitiated ? "2px solid #8baed4" : "none",
                                                        }}
                                                        onClick={() => setStartDateInitiated(false)}
                                                    >
                                                        <p
                                                            className={`text-left border-neutral50 ${isIncludeTime ? "w-1/2 border-r" : "w-full"
                                                                } whitespace-nowrap`}
                                                        >
                                                            {startDate ? moment.utc(startDate).format("DD MMM YYYY") : <span className="text-neutral80 text-sm">Select Start Date</span>}
                                                        </p>
                                                    </div>
                                                    {isEndDate && (
                                                        <>
                                                            <div
                                                                className={`flex border rounded-lg ${errorDate ? "border-danger500 bg-danger50" : startDateInitiated ? "border-primary500 bg-white" : "border-neutral50 bg-white"
                                                                    } h-10 p-2 w-full cursor-pointer`}
                                                                style={{
                                                                    outline: startDateInitiated ? "2px solid #8baed4" : "none",
                                                                }}
                                                                onClick={() => setStartDateInitiated(true)}
                                                            >
                                                                <p
                                                                    className={`text-left border-neutral50 ${isIncludeTime ? "w-1/2 border-r" : "w-full"
                                                                        } whitespace-nowrap`}
                                                                >
                                                                    {endDate ? moment.utc(endDate).format("DD MMM YYYY") : <span className="text-neutral80 text-sm">Select End Date</span>}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {errorDate === true && (
                                                        <div className="flex mt-1 w-full">
                                                            <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                                                            {errorDate === true && (
                                                                <div className="flex mt-1 w-full">
                                                                    <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                                                                    {
                                                                        endDate ?
                                                                            <p className="text-danger500 text-sm text-left">
                                                                                End Time cannot be earlier<br></br>than Start Time.
                                                                            </p>
                                                                            :
                                                                            <p className="text-danger500 text-sm text-left">
                                                                                End date is required
                                                                            </p>
                                                                    }
                                                                </div>
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
                                            setErrorDate(false)
                                        }}
                                        startDate={startDate && moment(startDate, "YYYY-MM-DDTHH:mm").toDate()}
                                        endDate={endDate && moment(endDate, "YYYY-MM-DDTHH:mm").toDate()}
                                        selectsEnd
                                        minDate={startDate}
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
                                                        onClick={!prevMonthButtonDisabled && decreaseMonth}
                                                    />

                                                    <p className="font-bold">
                                                        {moment.utc(date).format("MMMM")} {moment.utc(date).format("YYYY")}
                                                    </p>

                                                    <CaretRight
                                                        size={24}
                                                        color="#636364"
                                                        className={!nextMonthButtonDisabled ? "cursor-pointer" : "cursor-default"}
                                                        onClick={!nextMonthButtonDisabled && increaseMonth}
                                                    />
                                                </div>

                                                <div
                                                    className={`flex flex-col items-center justify-between gap-1`}
                                                >
                                                    <div
                                                        className={`flex border rounded-lg ${errorDate ? "border-danger500 bg-danger50" : startDateInitiated ? "border-primary500 bg-white" : "border-neutral50 bg-white"
                                                            } h-10 p-2 w-full cursor-pointer`}
                                                        style={{
                                                            outline: !startDateInitiated ? "2px solid #8baed4" : "none",
                                                        }}
                                                        onClick={() => setStartDateInitiated(false)}
                                                    >
                                                        <p
                                                            className={`text-left border-neutral50 ${isIncludeTime ? "w-1/2 border-r" : "w-full"
                                                                } whitespace-nowrap`}
                                                        >
                                                            {startDate ? moment.utc(startDate).format("DD MMM YYYY") : <span className="text-neutral80 text-sm">Select Start Date</span>}
                                                        </p>
                                                    </div>
                                                    {isEndDate && (
                                                        <>
                                                            <div
                                                                className={`flex border rounded-lg ${errorDate ? "border-danger500 bg-danger50" : startDateInitiated ? "border-primary500 bg-white" : "border-neutral50 bg-white"
                                                                    } h-10 p-2 w-full cursor-pointer`}
                                                                style={{
                                                                    outline: startDateInitiated ? "2px solid #8baed4" : "none",
                                                                }}
                                                                onClick={() => setStartDateInitiated(true)}
                                                            >
                                                                <p
                                                                    className={`text-left border-neutral50 ${isIncludeTime ? "w-1/2 border-r" : "w-full"
                                                                        } whitespace-nowrap`}
                                                                >
                                                                    {endDate ? moment.utc(endDate).format("DD MMM YYYY") : <span className="text-neutral80 text-sm">Select End Date</span>}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {errorDate === true && (
                                                        <div className="flex mt-1 w-full">
                                                            <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                                                            {errorDate === true && (
                                                                <div className="flex mt-1 w-full">
                                                                    <Info className="text-danger500 mr-2 shrink-0 mt-0.5" />
                                                                    {
                                                                        endDate ?
                                                                            <p className="text-danger500 text-sm text-left">
                                                                                End Time cannot be earlier<br></br>than Start Time.
                                                                            </p>
                                                                            :
                                                                            <p className="text-danger500 text-sm text-left">
                                                                                End date is required
                                                                            </p>
                                                                    }
                                                                </div>
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

                                    <div className="flex items-center gap-2">
                                        {/* Switch to activate time picker */}
                                        <Switch onChange={toggleIsIncludeTime} checked={isIncludeTime} isEdit={disableToggles ? false : true} />
                                        <p>Include Time</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4">
                                    <OutlineButton title="Cancel" type="full" onClick={() => setOpenOption(!openOption)} />
                                    <PrimaryButton title="Apply" type="full" onClick={handleApply} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterDropdownMixed;