import { Funnel } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { PiCaretRight, PiInfo } from "react-icons/pi";

const DropdownCheckbox = ({
    options = [],
    onSelect,
    title = "Title Dropdown",
    placeholder = "Placeholder",
    isRequired = true,
    isEdited = true,
    mode = "default",
    footer = null,
    currentValues = [],
    className = "",
    handleCheckCampaignPeriod
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenOption, setIsOpenOption] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const dropdownRef = useRef(null);
    const hasData = options.length > 0;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsOpenOption(false);
            }
        };
        if (isOpen || isOpenOption) document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, isOpenOption]);

    useEffect(() => {
        const valuesOnly = currentValues.map((item) =>
            typeof item === "object" && item !== null ? item.value : item
        );
        setSelectedValues(valuesOnly);
    }, [currentValues]);

    const handleToggleDropdown = () => setIsOpen(!isOpen);

    const handleCheckboxChange = (value) => {
        const newSelected = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        setSelectedValues(newSelected);
        const selectedObjects = options.filter((opt) => newSelected.includes(opt.value));
        if (onSelect) onSelect(selectedObjects);
    };

    const handleCheckAll = () => {
        if (selectedValues.length === options.length) {
            setSelectedValues([]);
            if (onSelect) onSelect([]);
        } else {
            const allValues = options.map((opt) => opt.value);
            setSelectedValues(allValues);
            if (onSelect) onSelect(options);
        }
    };

    const displayText =
        selectedValues.length === 0
            ? placeholder
            : selectedValues.length === 1
                ? (options.find((opt) => opt.value === selectedValues[0])?.label || placeholder)
                : selectedValues.length === options.length
                    ? "All Selected"
                    : `${selectedValues.length} Selected`;

    return (
        <div className={`relative inline-block text-left w-full ${className}`} ref={dropdownRef}>
            {title && (
                <div className="flex">
                    <p className="text-sm font-normal text-black mb-1">{title}</p>
                    {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
                </div>
            )}

            {/* Button */}
            <div>
                <span className="rounded-md shadow-sm">
                    <button
                        type="button"
                        className={`
              ${!isEdited && "bg-neutral30 cursor-not-allowed"} 
              ${mode === "default" && selectedValues.length === 0 && "border-neutral50 bg-neutral20"} 
              ${mode === "default" && selectedValues.length > 0 && "border-black bg-neutral20"} 
              ${mode === "danger" && "border-danger500 bg-danger50"} 
              flex items-center w-full py-2.5 text-left px-4 font-normal text-sm text-neutral300 rounded-md border focus:outline-none overflow-hidden
            `}
                        onClick={() => isEdited && handleToggleDropdown()}
                    >
                        <span className="flex-grow overflow-hidden text-black">{displayText}</span>
                        <span className="ml-2">
                            <Funnel className="text-neutral300" size={20} />
                        </span>
                    </button>
                </span>
            </div>

            {/* Main Modal */}
            {isOpen && isEdited && (
                <div
                    className="z-20 origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="px-1 py-2 max-h-40 overflow-y-auto">
                        <div
                            className="flex items-center py-2.5 px-4 my-0.5 rounded-md hover:bg-neutral20 cursor-pointer"
                            onClick={() => {
                                handleCheckCampaignPeriod()
                                setIsOpen(false)
                                setIsOpenOption(false)
                            }}
                        >
                            <p className="text-sm text-black">By Campaign Period</p>
                        </div>
                        <div
                            className="flex items-center justify-between py-2.5 px-4 my-0.5 rounded-md hover:bg-neutral20 cursor-pointer"
                            onClick={() => setIsOpenOption(true)}
                        >
                            <p className="text-sm text-black">By Indicators</p>
                            <PiCaretRight size={20} />
                        </div>
                    </div>
                </div>
            )}

            {/* Indicators Panel (muncul di samping kanan modal utama) */}
            {isOpenOption && (
                <div
                    className="absolute z-30 w-56 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
                    style={{
                        top: '7rem', // setara dengan top-24
                        left: '-230px', // geser ke kiri sesuai lebar popover utama
                    }}
                >
                    {hasData ? (
                        <div className="px-1 py-2 max-h-40 overflow-y-auto">
                            {/* Select All */}
                            <div
                                className="flex items-center py-2.5 px-4 my-0.5 rounded-md hover:bg-neutral20 cursor-pointer"
                                onClick={handleCheckAll}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedValues.length === options.length}
                                    readOnly
                                    className="mr-2"
                                />
                                <p className="text-sm text-black">Select All</p>
                            </div>
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center py-2.5 px-4 my-0.5 rounded-md hover:bg-neutral20 cursor-pointer"
                                    onClick={() => handleCheckboxChange(option.value)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(option.value)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    <p className="text-sm text-black">{option.label}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white py-2.5 px-4 my-0.5 rounded-md">
                            <p className="text-sm text-neutral500">No data</p>
                        </div>
                    )}
                </div>
            )}

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

export default DropdownCheckbox;