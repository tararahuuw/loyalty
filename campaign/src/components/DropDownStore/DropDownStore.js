import React, { useState, useEffect, useRef } from "react";
import { CaretDownIcon, CaretRightIcon, XIcon, InfoIcon } from "@phosphor-icons/react";

const DropDownStore = ({
  options = [
    {
      menu: "Type",
      parameter: "type",
      submenu: [
        {
          option: "Type 1",
          value: "type1",
        },
      ],
      type: "checkbox",
    },
    {
      menu: "Status",
      parameter: "status",
      submenu: [
        {
          option: "Status 1",
          value: "status1",
        },
      ],
      type: "radiobutton",
    },
    {
      menu: "Payment",
      parameter: "payment",
      submenu: [
        {
          option: "Payment 1",
          value: "payment1",
        },
      ],
      type: "checkbox",
    },
    {
      menu: "Payment 2",
      parameter: "payment 2",
      submenu: [
        {
          option: "Payment 2",
          value: "payment2",
        },
      ],
      type: "checkbox",
    },
    {
      menu: "Payment 3",
      parameter: "payment 3",
      submenu: [
        {
          option: "Payment 3",
          value: "payment3",
        },
      ],
      type: "checkbox",
    },
  ],
  dataFilterResult,
  setDataFilterResult = () => {},
  footer,
  mode = "default",
  title = "",
  isRequired = true,
  multiselect = true,
}) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const submenuRef = useRef(null);
  const optionRefs = useRef([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showFilterSubmenu, setShowFilterSubmenu] = useState(false);
  const [dataSelectionOptionMenu, setDataSelectionOptionMenu] = useState();

  const handleOnClickOption = (submenu, type, parameter) => {
    if (type === "checkbox") {
      const current = dataFilterResult[parameter] || [];

      // normalize: get comparable ID for submenu and items in array
      const getId = (item) => item?.id ?? item?.value ?? item;
      const submenuId = getId(submenu.raw || submenu);

      let updatedData = [];

      if (multiselect) {
        // Multiple select mode
        const alreadyExists = current.some((item) => getId(item) === submenuId);
        if (alreadyExists) {
          updatedData = current.filter((item) => getId(item) !== submenuId);
        } else {
          updatedData = [...current, submenu.raw || submenu.value];
        }
      } else {
        // Single select mode
        const alreadySelected = current.length > 0 && getId(current[0]) === submenuId;

        if (alreadySelected) {
          // Clicking the same store → unselect
          updatedData = [];
        } else {
          // Replace with new single store
          updatedData = [submenu.raw || submenu.value];
        }
      }

      const newState = {
        ...dataFilterResult,
        [parameter]: updatedData,
      };
      setDataFilterResult(newState);
    } else if (type === "radiobutton") {
      if (dataFilterResult[parameter]?.[0] === submenu.value) {
        setDataFilterResult((prevState) => ({
          ...prevState,
          [parameter]: [],
        }));
      } else {
        setDataFilterResult((prevState) => ({
          ...prevState,
          [parameter]: [submenu.value],
        }));
      }
    }
  };

  const handleResetFilter = () => {
    const resetDataFilterResult = Object.fromEntries(Object.keys(dataFilterResult).map((key) => [key, []]));
    setDataFilterResult(resetDataFilterResult);
    setShowFilterMenu(false);
    setShowFilterSubmenu(false);
  };

  useEffect(() => {
    if (!showFilterMenu) return;

    const updatePosition = () => {
      if (!buttonRef.current || !dropdownRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      dropdownRef.current.style.top = `${rect.bottom}px`;
      dropdownRef.current.style.left = `${rect.left}px`;
      dropdownRef.current.style.width = `${rect.width}px`; // optional but recommended
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showFilterMenu]);

  useEffect(() => {
    if (!showFilterSubmenu || !submenuRef.current || dataSelectionOptionMenu == null) return;

    const index = options.findIndex((opt) => opt.menu === dataSelectionOptionMenu);

    const parentEl = optionRefs.current[index];
    if (!parentEl) return;

    const rect = parentEl.getBoundingClientRect();

    submenuRef.current.style.top = `${rect.top + 10}px`;
    submenuRef.current.style.left = `${rect.right + 20}px`; // spacing
  }, [showFilterSubmenu, dataSelectionOptionMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
        setShowFilterSubmenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Select Component */}
      <div>
        {title && (
          <span className="text-sm font-normal text-black mb-1">
            {title}
            {isRequired && <span className="text-sm font-normal text-danger500 ml-1">*</span>}
          </span>
        )}

        <div className="rounded-md shadow-sm">
          <div className="flex w-full">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              ref={buttonRef}
              type="button"
              className={`${
                mode === "danger"
                  ? "bg-danger50 border-danger500 focus:outline-2 outline-danger500"
                  : Object.values(dataFilterResult).flat().length
                  ? "border-black text-black bg-neutral20"
                  : "border-neutral50 text-neutral300 bg-neutral20"
              } flex items-center text-left px-4 font-normal text-sm rounded-md border focus:outline-none w-full`}
            >
              <span className="flex-grow py-2.5">
                {dataFilterResult?.store?.length
                  ? dataFilterResult.store.length === 1
                    ? dataFilterResult.store[0]?.name || dataFilterResult.store[0]?.label
                    : `${dataFilterResult.store.length} Store Selected`
                  : "Choose Store"}
              </span>

              {Object.values(dataFilterResult).flat().length ? (
                <span className="ml-2" onClick={handleResetFilter}>
                  <XIcon size={16} className="text-black" />
                </span>
              ) : (
                <span className="ml-2">
                  <CaretDownIcon size={16} className="text-neutral300" />
                </span>
              )}
            </button>
          </div>
        </div>

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

      {/* Drop Down Component */}
      <div className="relative">
        {showFilterMenu && (
          <div ref={dropdownRef} className="fixed z-50 bg-white border border-neutral40 rounded-md p-3 shadow-md">
            {options.map((option, index) => (
              <div key={index}>
                <div
                  ref={(el) => (optionRefs.current[index] = el)}
                  className={`hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center cursor-pointer justify-between`}
                  onClick={() => {
                    setShowFilterSubmenu(true);
                    setDataSelectionOptionMenu(option.menu);
                  }}
                >
                  <p>{option.menu}</p>
                  {(dataFilterResult[option.parameter]?.length || 0) === 0 ? (
                    <CaretRightIcon size={16} className="text-neutral300" />
                  ) : (
                    <div className="w-4 h-4 border border-primary500 rounded-full flex items-center justify-center text-primary500">
                      <p style={{ fontSize: "8px" }}>{dataFilterResult[option.parameter]?.length || 0}</p>
                    </div>
                  )}
                </div>
                {showFilterSubmenu && option.submenu.length > 0 && dataSelectionOptionMenu === option.menu && (
                  <div
                    ref={submenuRef}
                    className="fixed z-50 ml-1 border border-neutral40 bg-white p-3 shadow-md rounded-md cursor-pointer max-h-48 overflow-y-auto"
                  >
                    {option.submenu.map((submenu, subIndex) => {
                      const getId = (item) => item?.id ?? item?.value ?? item;
                      return (
                        <div
                          key={subIndex}
                          className="flex bg-white hover:bg-neutral20 rounded-md py-2.5 px-2 my-0.5"
                          onClick={() => {
                            handleOnClickOption(submenu, option.type, option.parameter);
                          }}
                        >
                          {option.type === "checkbox" && (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={
                                  dataFilterResult[option.parameter]?.some(
                                    (item) => getId(item) === getId(submenu.raw || submenu)
                                  ) || false
                                }
                                onChange={() => handleOnClickOption(submenu, option.type, option.parameter)}
                              />
                              <p
                                className={`text-sm ${
                                  dataFilterResult[option.parameter]?.some(
                                    (item) => (item?.value ?? item?.id ?? item) === submenu.value
                                  )
                                    ? "text-primary500"
                                    : "text-black"
                                } whitespace-nowrap`}
                              >
                                {submenu.option}
                              </p>
                            </div>
                          )}
                          {option.type === "radiobutton" && (
                            <div className="flex items-center">
                              <input
                                type="radio"
                                className="mr-2"
                                checked={dataFilterResult[option.parameter]?.[0] === submenu.value}
                                onChange={() => handleOnClickOption(submenu, option.type, option.parameter)}
                              />
                              <p
                                className={`text-sm ${
                                  dataFilterResult[option.parameter]?.[0] === submenu.value
                                    ? "text-primary500"
                                    : "text-black"
                                } whitespace-nowrap`}
                              >
                                {submenu.option}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownStore;
