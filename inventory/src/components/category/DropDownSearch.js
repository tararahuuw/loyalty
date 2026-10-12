import React, { useState, useEffect, useRef } from "react";
import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { PrimaryButton } from "sprint-asia-custom-component";

const DropDownSearch = ({
  options = [
    { option: "Male", value: "Male" },
    { option: "Female", value: "Female" },
  ],
  onSelect,
  placeholder = "",
  currentOption = "",
  onAddNewCategory,
  error,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const selectedValue = options.filter((val) => {
    return val.value === currentOption;
  });

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
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left w-full">
      <div ref={buttonRef}>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className={`
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
              ${!currentOption && "border-neutral50 bg-neutral20"} 
              ${currentOption && "border-black bg-neutral20"} 
              flex items-center w-full px-4 py-3 text-left font-normal text-sm text-neutral300 rounded-md border focus:outline-none overflow-hidden`}
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className="flex-grow overflow-hidden">
              {selectedValue?.length ? selectedValue[0]?.option : placeholder}
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

        {error && <p className="text-danger500 text-xs">{error}</p>}
      </div>

      {/* Drop Down Options */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="z-20 fixed rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="px-1 py-2">
            <div className="border rounded-md border-neutral50 grid grid-cols-3 gap-2 p-2">
              <input
                className="p-2 rounded-md col-span-2 focus:outline-none focus:border-none"
                placeholder="Input new"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />

              <div className="col-span-1">
                <PrimaryButton
                  title="Add"
                  type="full"
                  isActive={input}
                  onClick={() => {
                    onAddNewCategory(input, input);
                    setInput("");
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto">
              {options.length ? (
                options.map((option, index) => (
                  <div
                    key={index}
                    className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md"
                    onClick={() => {
                      if (option.option !== "Loading...") {
                        handleOptionClick(option);
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
        </div>
      )}
    </div>
  );
};

export default DropDownSearch;
