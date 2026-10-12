import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";

const SearchDropDown = ({
  options = [
    {
      option: "Name 1",
      value: "Value 1",
    },
    {
      option: "Name 2",
      value: "Value 2",
    },
  ],
  placeholderSearch = "Search Here",
  filterDropdown = { option: "", value: "" },
  setFilterDropdown,
  onEnterPress,
  onSubmitDate,
}) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [isEndDate, setIsEndDate] = useState(false);
  const [isIncludeTime, setIsIncludeTime] = useState(false);

  const dropdownRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnterPress(input);
    }
  };

  const handleClickOption = (data) => {
    setIsOpen(false);
    setFilterDropdown(data);
  };

  useEffect(() => {
    if (filterDropdown.value !== "transactionDate") {
      setStartDate("");
      setEndDate(null);
      setIsEndDate(false);
      setIsIncludeTime(false);
    }
  }, [filterDropdown.value]);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <div className="flex items-center h-full">
        <div
          className={`${
            input ? "border-black" : "border-neutral50"
          } relative cursor-pointer border-t border-b border-l rounded-tl-md rounded-bl-md`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center bg-white rounded-tl-md rounded-bl-md" style={{ minWidth: "144px" }}>
            <p className="flex items-center w-full py-2.5 text-left pl-4 pr-4 bg-white rounded-md font-bold text-sm text-neutral300">
              {filterDropdown.option}
            </p>
            {isOpen ? <CaretUpIcon /> : <CaretDownIcon />}
            <p className={`${input ? "text-black" : "text-neutral50"} ml-3`}>|</p>
          </div>
          {isOpen && (
            <div
              className="z-10 origin-top-left absolute left-0 mt-2 w-full rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="px-1 py-2 max-h-48 overflow-y-auto">
                {options?.length > 0 ? (
                  options.map((option, index) => (
                    <div
                      key={index}
                      className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md cursor-pointer"
                      onClick={() => handleClickOption(option)}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm text-black">{option.option}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-normal text-black flex justify-center">
                    <p>Data Not Available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className={`${
            input ? "border-black" : "border-neutral50"
          } relative border-t border-b border-r rounded-tr-md rounded-br-md`}
        >
          {filterDropdown.value !== "transactionDate" ? (
            <div className="flex items-center bg-white rounded-tr-md rounded-br-md focus:outline-none">
              <MagnifyingGlassIcon
                className={`${
                  input ? "text-black" : "text-neutral50"
                } absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4`}
              />
              <input
                type="search"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className="flex items-center w-full py-2.5 text-left pl-8 pr-4 bg-white rounded-md font-normal text-sm text-black focus:outline-none"
                placeholder={placeholderSearch}
              />
            </div>
          ) : (
            <CustomDateTimePicker
              value={[startDate, endDate, isEndDate, isIncludeTime]}
              placeholder="Select Transaction Date"
              onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                onSubmitDate(startDate, endDate, isEndDate, isIncludeTime);

                setStartDate(startDate);
                setEndDate(endDate);
                setIsEndDate(isEndDate);
                setIsIncludeTime(isIncludeTime);
              }}
              mode="filter"
              className="w-full max-w-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDropDown;
