import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";

const DropdownText = ({
  options = [],
  onSelect,
  title = "Title Dropdown",
  placeholder = "Placeholder",
  isRequired = true,
  isEdited = true,
  mode = "default",
  footer = null,
  currentOption = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggleDropdownText = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option, value) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect({ option: option, value: value });
    }
  };

  const selectedValue = options.find((val) => val.value === currentOption);

  const hasData = options.length > 0;

  return (
    <div className={`relative inline-block text-left w-full ${className}`} ref={dropdownRef}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className={`
              ${!isEdited && "bg-neutral30 cursor-not-allowed"} 
              ${mode === "default" && currentOption === "" && "border-neutral50 bg-neutral20 cursor-pointer"} 
              ${mode === "default" && currentOption !== "" && "border-black bg-neutral20 cursor-pointer"} 
              ${mode === "danger" && "border-danger500 bg-danger50 cursor-pointer"} 
              flex items-center w-full py-2.5 text-left px-4 font-normal text-sm text-neutral300 rounded-md border focus:outline-none overflow-hidden`}
            onClick={() => isEdited && handleToggleDropdownText()}
          >
            <span className="flex-grow overflow-hidden">{selectedValue ? selectedValue.option : placeholder}</span>
            <span className="ml-2">
              {isOpen ? (
                <CaretUp size={16} className="text-neutral300" />
              ) : (
                <CaretDown size={16} className="text-neutral300" />
              )}
            </span>
          </button>
        </span>
      </div>

      {isOpen && isEdited && (
        <div
          className="z-20 origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="px-1 py-2 max-h-40 overflow-y-auto">
            {hasData ? (
              options.map((option, index) => (
                <div
                  key={index}
                  className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md"
                  onClick={() => {
                    if (option.option !== "Loading...") {
                      handleOptionClick(option.option, option.value);
                    }
                  }}
                >
                  <p className="text-sm text-black">{option.option}</p>
                </div>
              ))
            ) : (
              <div className="bg-white py-2.5 px-4 my-0.5 rounded-md">
                <p className="text-sm text-neutral500">No data</p>
              </div>
            )}
          </div>
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

export default DropdownText;
