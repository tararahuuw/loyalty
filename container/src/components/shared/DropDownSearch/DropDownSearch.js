import React, { useEffect, useState, useCallback } from "react";
import { Info } from "@phosphor-icons/react";

import { useDisclosure } from "../../../hooks/useDisclosure";
import { useFetch } from "../../../hooks/useFetch";

import _ from "lodash";
import { useRef } from "react";

const DropDownSearch = ({
  onChange,
  value,
  className,
  title,
  isRequired,
  leftIcon,
  rightIcon,
  mode,
  footer,
  placeholder,
  service,
  queryName,
  params = {},
  dependencies = [],
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isOpen, toggle, open, close } = useDisclosure(false);
  const [input, setInput] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [id, setId] = useState("");
  const dropDownRef = useRef(null);

  // Fetch data using react query
  const { data } = useFetch(service, queryName, [...dependencies, input], {
    body: { search: input, ...params },
  });

  const searchHandler = useCallback(
    _.debounce((value) => {
      setInput(value.toLocaleLowerCase());
    }, 500),
    []
  );

  const handleFocus = () => {
    setIsFocused(true);
    open();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOptionClick = (option) => {
    close();
    setInput(option.name);
    setSelectedValue(option.name);
    if (onChange) {
      onChange(option);
    }
  };

  const defaultValue = data?.data?.filter((item) => item.id === id);

  useEffect(() => {
    setInput("");
    setSelectedValue("");
  }, [...dependencies]);

  useEffect(() => {
    if (defaultValue?.length) {
      handleOptionClick(defaultValue[0]);
    }
  }, [defaultValue?.length]);

  useEffect(() => {
    setId(value);
  }, [value]);

  useEffect(() => {
    setTimeout(() => setId(""), 3000);
  }, [selectedValue]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        toggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={`flex flex-col justify-between w-full relative ${className}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      <div className="h-10">
        <input
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            searchHandler(e.target.value);
          }}
          placeholder={placeholder}
          className={`z-20 top-0 py-2.5 px-4 w-full font-normal text-sm text-neutral300 rounded-md border
                ${!value && mode === "default" && "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"}
                ${value && mode === "default" && "bg-neutral20 border-black focus:outline-2 outline-primary500"}
                ${isFocused && mode === "default" && "bg-neutral20 border-primary500"}
                ${mode === "disable" && "bg-neutral30 border-neutral50"}
                ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
                ${leftIcon ? "pl-8" : "pl-3"}
                ${rightIcon ? "pr-8" : "pr-3"}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
        />
      </div>

      {/* Select options */}
      {isOpen && (
        <div
          ref={dropDownRef}
          style={{
            top: "70px",
          }}
          className={`absolute z-20 left-0 w-full rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden 
            px-1 py-2 max-h-56 overflow-y-auto flex flex-col gap-1`}
        >
          {data?.data?.length ? (
            data?.data?.map((option, index) => (
              <div
                key={index}
                className={`hover:bg-neutral20 ${
                  value === option.id ? "bg-neutral20" : "bg-white"
                } py-2.5 px-4 rounded-md text-sm text-black cursor-pointer`}
                onClick={() => handleOptionClick(option)}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div
              className={`hover:bg-neutral20 "bg-white" py-2.5 px-4 rounded-md text-sm text-black cursor-pointer italic`}
            >
              Product name not found
            </div>
          )}
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

export default DropDownSearch;
