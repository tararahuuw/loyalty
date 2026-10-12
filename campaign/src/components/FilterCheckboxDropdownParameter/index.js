import React, { useState, useRef, useEffect } from "react";
import { PiCaretDown, PiCaretUp, PiInfo } from "react-icons/pi";

const FilterCheckboxDropdownParameter = ({
  parentRef,
  closeAllDropdowns,
  options = [],
  currentValue = [],
  buttonText = "Filter",
  onSelect,
  isEdited = true,
  footer = null,
  mode = "default",
  formik,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setSelectedOptions(currentValue);
    setSelectAll(currentValue.length === options.length);
  }, [currentValue]);

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

  // Menutup dropdown jika klik terjadi di luar elemen dropdown atau button
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

  const handleOptionClick = (optionValue) => {
    const updatedOptions = selectedOptions.some((option) => option.value === optionValue.value)
      ? selectedOptions.filter((selected) => selected.value !== optionValue.value)
      : [...selectedOptions, optionValue];

    setSelectedOptions(updatedOptions);
    if (onSelect) {
      onSelect(updatedOptions);
    }
  };

  return (
    <div className="relative w-80">
      <button
        ref={buttonRef}
        className={`flex items-center w-full py-2.5 text-left px-4 ${
          mode === "danger"
            ? "text-neutral300 bg-danger50 border-danger500"
            : currentValue.length === 0
            ? "text-neutral300 bg-neutral20 border-neutral300"
            : "text-neutral300 bg-neutral20 border-black"
        } font-normal text-sm rounded-md border focus:outline-none`}
        onClick={(e) => {
          e.stopPropagation();
          closeAllDropdowns();
          setIsOpen(!isOpen);
        }}
      >
        <span className="flex-grow">
          {currentValue.length === options.length && options.length > 0
            ? `All ${buttonText}`
            : currentValue.length === 0
            ? "Please choose " + buttonText
            : currentValue.length === 1
            ? `${currentValue[0].option || currentValue[0].value}`
            : `${currentValue.length} filter ${buttonText} choosen`}
        </span>
        <span className="ml-2">
          {isOpen ? (
            <PiCaretUp size={16} className="text-neutral300" />
          ) : (
            <PiCaretDown size={16} className="text-neutral300" />
          )}
        </span>
      </button>
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
        <div ref={dropdownRef} className={`fixed w-80 border border-neutral50 rounded-lg bg-white shadow-lg z-50`}>
          {options.length === 0 ? (
            <div className="hover:bg-neutral20 bg-white py-2.5 px-4 m-2 rounded-md text-sm text-neutral500 text-center">
              No Data
            </div>
          ) : (
            <>
              <div
                className={`hover:bg-neutral20 bg-white py-2.5 px-4 m-2 rounded-md flex items-center ${
                  isEdited ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!isEdited) return;
                  if (selectAll) {
                    onSelect([]);
                    setSelectedOptions([]);
                  } else {
                    const filteredOptions = options.filter((option) => {
                      if (type === "Main") {
                        return !formik.values.param.some((param) =>
                          (param.exception?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                        );
                      }

                      if (type === "Exception") {
                        return !formik.values.param.some((param) =>
                          (param.value?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                        );
                      }

                      return true;
                    });
                    onSelect(filteredOptions);
                    setSelectedOptions(filteredOptions);
                  }
                }}
              >
                <input
                  type="checkbox"
                  className={`mr-2 ${isEdited ? "cursor-pointer" : "cursor-not-allowed"}`}
                  style={{ accentColor: isEdited ? "primary500" : "#636364" }}
                  checked={selectAll}
                  onChange={() => {
                    if (!isEdited) return;

                    if (selectAll) {
                      onSelect([]);
                      setSelectedOptions([]);
                    } else {
                      const filteredOptions = options.filter((option) => {
                        if (type === "Main") {
                          return !formik.values.param.some((param) =>
                            (param.exception?.status || []).some(
                              (item) => (item.idStatus || item.value) === option.value
                            )
                          );
                        }

                        if (type === "Exception") {
                          return !formik.values.param.some((param) =>
                            (param.value?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                          );
                        }

                        return true;
                      });
                      onSelect(filteredOptions);
                      setSelectedOptions(filteredOptions);
                    }
                  }}
                />
                <p className={`text-sm text-black`}>Select All</p>
              </div>
              {options.map((option, index) => {
                const inValue = formik.values.param.some((param) =>
                  (param.value?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                );

                const inException = formik.values.param.some((param) =>
                  (param.exception?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                );

                const accentColor = isEdited
                  ? type === "Main"
                    ? inException
                      ? "#636364"
                      : "primary500"
                    : type === "Exception"
                    ? inValue
                      ? "#636364"
                      : "primary500"
                    : "primary500"
                  : "#636364";

                const isDisabled = accentColor === "#636364";

                return (
                  <div
                    key={index}
                    className={`hover:bg-neutral20 bg-white py-2.5 px-4 m-2 rounded-md flex items-center ${
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isEdited) return;
                      if (!isDisabled) handleOptionClick(option);
                    }}
                  >
                    <input
                      type="checkbox"
                      className={`mr-2 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                      style={{ accentColor }}
                      checked={
                        isEdited
                          ? formik.values.param.some(
                              (param) =>
                                (param.value?.status || []).some(
                                  (item) => (item.idStatus || item.value) === option.value
                                ) ||
                                (param.exception?.status || []).some(
                                  (item) => (item.idStatus || item.value) === option.value
                                )
                            )
                          : type === "Main"
                          ? formik.values.param.some((param) =>
                              (param.value?.status || []).some((item) => (item.idStatus || item.value) === option.value)
                            )
                          : type === "Exception"
                          ? formik.values.param.some((param) =>
                              (param.exception?.status || []).some(
                                (item) => (item.idStatus || item.value) === option.value
                              )
                            )
                          : false
                      }
                      onChange={() => {
                        if (!isEdited) return;
                        if (!isDisabled) handleOptionClick(option);
                      }}
                    />
                    <p className={`text-sm text-black ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      {option.option}
                    </p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterCheckboxDropdownParameter;
