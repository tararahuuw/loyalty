import React, { useState, useEffect, useRef } from "react";
import { CheckSquareIcon, SquareIcon, InfoIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

const DropDownText = ({
  options = [],
  onSelect = () => {},
  title = "Title Dropdown",
  placeholder = "-",
  isRequired = true,
  isEdited = true,
  mode = "default",
  footer = null,
  className = "",
  currentOption = [],
  itemName = "Item",
  multiselect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const allSelected = options.length > 0 && currentOption.length === options.length;

  const handleToggleDropDownText = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option, value) => {
    if (multiselect) {
      let updated;
      if (currentOption.includes(value)) {
        updated = currentOption.filter((v) => v !== value);
      } else {
        updated = [...currentOption, value];
      }
      onSelect(updated);
    } else if (onSelect) {
      onSelect({ option: option, value: value });
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onSelect([]);
    } else {
      const allValues = options.map((opt) => opt.value);
      onSelect(allValues);
    }
  };

  const hasData = options.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current || !dropdownRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setDropdownWidth(rect.width);

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
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left w-full ${className}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}
      <div>
        <span className="rounded-md shadow-sm">
          <button
            ref={buttonRef}
            type="button"
            className={`
              ${!isEdited && "bg-neutral30 cursor-not-allowed"} 
              ${mode === "default" && !currentOption.length && "border-neutral50 bg-neutral20 cursor-pointer"} 
              ${mode === "default" && currentOption.length && "border-black bg-neutral20 cursor-pointer"} 
              ${mode === "danger" && "border-danger500 bg-danger50 cursor-pointer"} 
              flex items-center w-full py-2.5 text-left px-4 font-normal text-sm text-neutral300 rounded-md border focus:outline-none overflow-hidden`}
            onClick={() => isEdited && handleToggleDropDownText()}
          >
            <span className="flex-grow overflow-hidden">
              {multiselect
                ? currentOption.length > 1
                  ? `${currentOption.length} ${itemName} Selected`
                  : currentOption.length === 1
                  ? options.find((val) => val.value === currentOption[0])?.option
                  : placeholder
                : currentOption[0]
                ? options.find((val) => val.value === currentOption[0])?.option
                : placeholder}
            </span>

            <span className="ml-2">
              {isOpen ? (
                <CaretUpIcon size={16} className="text-neutral300" />
              ) : (
                <CaretDownIcon size={16} className="text-neutral300" />
              )}
            </span>
          </button>
        </span>
      </div>

      {isOpen && isEdited && (
        <div
          ref={dropdownRef}
          style={{ width: `${dropdownWidth}px` }}
          className="fixed z-50 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="px-1 py-2 max-h-40 overflow-y-auto">
            {multiselect && onSelect && hasData && (
              <div
                className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center gap-2 cursor-pointer"
                onClick={handleSelectAll}
              >
                {allSelected ? <CheckSquareIcon weight="fill" className="text-primary500" /> : <SquareIcon />}
                <p className="text-sm text-black">Select All</p>
              </div>
            )}

            {hasData ? (
              options.map((option, index) => {
                const isSelected = currentOption.some((item) => item === option.value);
                if (multiselect) {
                  return (
                    <div
                      key={index}
                      className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        if (option.option !== "Loading...") {
                          handleOptionClick(option.option, option.value);
                        }
                      }}
                    >
                      {isSelected ? <CheckSquareIcon weight="fill" className="text-primary500" /> : <SquareIcon />}
                      <p className="text-sm text-black">{option.option}</p>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        handleOptionClick(option.option, option.value);
                        setIsOpen(false);
                      }}
                    >
                      <p className="text-sm text-black">{option.option}</p>
                    </div>
                  );
                }
              })
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
                <InfoIcon size={16} className="text-danger500" />
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

export default DropDownText;
