import React, { useRef, useEffect, useState } from "react";
import { PiCaretDown, PiCaretUp } from "react-icons/pi";

const MultiSelectDropdownText = ({
    placeholder = "",
    title = "",
    isRequired = true,
    mode = "default",
    footer = null,
    onChange = () => {},
    optionsData = [],
    value = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const mappedOptions = optionsData.map(({ value, option, ...rest }) => ({
        id: value,
        name: option,
        ...rest
    }));

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleOptionChange = (option) => {
        const alreadySelected = value.some((item) => item.id === option.id);
        if (alreadySelected) {
            onChange(value.filter((item) => item.id !== option.id));
        } else {
            onChange([...value, option]);
        }
    };

    const handleSelectAll = () => {
        if (value.length === mappedOptions.length) {
            onChange([]);
        } else {
            onChange(mappedOptions);
        }
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {title && (
                <div className="flex mb-1">
                    <p className="text-sm font-normal text-black">{title}</p>
                    {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
                </div>
            )}

            <button
                type="button"
                onClick={toggleDropdown}
                className={`
                    flex items-center w-full py-2.5 px-4 text-sm rounded-md border focus:outline-none overflow-hidden text-left
                    ${mode === "danger"
                        ? "border-danger500 bg-danger50 text-danger500"
                        : value.length === 0
                            ? "border-neutral50 bg-neutral20 text-neutral300"
                            : "border-black bg-neutral20 text-black"
                    }
                `}
            >
                <div className="flex flex-wrap gap-1 flex-grow">
                    {value.length > 0 ? (
                        value.map((option, index) => (
                            <span
                                key={option.id}
                                className="text-black"
                            >
                                {option.name}{value.length - 1 !== index && ", "}
                            </span>
                        ))
                    ) : (
                        <span className="text-neutral300">{placeholder}</span>
                    )}
                </div>

                <span className="ml-2 text-neutral300">
                    {isOpen ? <PiCaretUp size={16} /> : <PiCaretDown size={16} />}
                </span>
            </button>

            {isOpen && (
                <div className="z-20 origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="px-1 py-2 max-h-40 overflow-y-auto">
                        <label className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-neutral20 rounded-md cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value.length === mappedOptions.length}
                                onChange={handleSelectAll}
                            />
                            Select all
                        </label>

                        {mappedOptions.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-neutral20 rounded-md cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={value.some((item) => item.id === option.id)}
                                    onChange={() => handleOptionChange(option)}
                                />
                                {option.name}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {footer && <div className="mt-1 text-xs text-danger500">{footer}</div>}
        </div>
    );
};

export default MultiSelectDropdownText;