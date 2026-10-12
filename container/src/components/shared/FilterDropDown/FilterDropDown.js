import React, { useState, useEffect, useRef } from "react";
import { Funnel, CaretRight, X } from "@phosphor-icons/react";

const FilterDropDown = ({
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
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showFilterSubmenu, setShowFilterSubmenu] = useState(false);

  const [dataSelectionOptionMenu, setDataSelectionOptionMenu] = useState();
  const [dataFilterCheckbox, setDataFilterCheckbox] = useState([]);
  const [dataFilterStatus, setDataFilterStatus] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterMenu(false);
        setShowFilterSubmenu(false);
      }
    };

    if (showFilterMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilterMenu]);

  const handleResetFilter = () => {
    const resetDataFilterResult = Object.fromEntries(Object.keys(dataFilterResult).map((key) => [key, []]));
    setDataFilterResult(resetDataFilterResult);
    setShowFilterMenu(false);
    setShowFilterSubmenu(false);
  };

  const handleOnClickOption = (submenu, type, parameter) => {
    if (type === "checkbox") {
      const isSubmenuExist = dataFilterResult[parameter]?.includes(submenu.value);
      const updatedData = [...(dataFilterResult[parameter] || [])];

      if (isSubmenuExist) {
        const index = updatedData.indexOf(submenu.value);
        updatedData.splice(index, 1);
      } else {
        updatedData.push(submenu.value);
      }
      setDataFilterResult((prevState) => ({
        ...prevState,
        [parameter]: updatedData,
      }));
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

  const buttonText =
    Object.values(dataFilterResult).flat().length > 0
      ? `${Object.values(dataFilterResult).flat().length} Filter Selected`
      : "Filter";

  return (
    <div>
      <div>
        <span className="rounded-md shadow-sm">
          <div className="flex">
            <button
              type="button"
              className={`${
                Object.values(dataFilterResult).flat().length
                  ? "border-black text-black"
                  : "border-neutral50 text-neutral300"
              } flex items-center w-60 text-left px-3 bg-white font-normal text-sm rounded-md border focus:outline-none`}
            >
              <span className="flex-grow py-2.5" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                {buttonText}
              </span>
              {Object.values(dataFilterResult).flat().length ? (
                <span className="ml-2" onClick={handleResetFilter}>
                  <X size={16} className="text-black" />
                </span>
              ) : (
                <span className="ml-2">
                  <Funnel size={16} className="text-neutral300" />
                </span>
              )}
            </button>
          </div>
        </span>
      </div>
      <div className="relative">
        {showFilterMenu && (
          <div
            ref={dropdownRef}
            className="bg-white border border-neutral40 w-48 rounded-md p-3 top-1 absolute z-10 shadow-md"
          >
            {options.map((option, index) => (
              <div key={index}>
                <div
                  className={`hover:bg-neutral20 bg-white py-2.5 px-2 my-0.5 rounded-md flex items-center cursor-pointer justify-between`}
                  onClick={() => {
                    setShowFilterSubmenu(true);
                    setDataSelectionOptionMenu(option.menu);
                  }}
                >
                  <p>{option.menu}</p>
                  {(dataFilterResult[option.parameter]?.length || 0) === 0 ? (
                    <CaretRight size={16} className="text-neutral300" />
                  ) : (
                    <div className="w-4 h-4 border border-primary500 rounded-full flex items-center justify-center text-primary500">
                      <p style={{ fontSize: "8px" }}>{dataFilterResult[option.parameter]?.length || 0}</p>
                    </div>
                  )}
                </div>
                {showFilterSubmenu && option.submenu.length > 0 && dataSelectionOptionMenu === option.menu && (
                  <div
                    className={`ml-1 border border-neutral40 bg-white p-3 shadow-md rounded-md absolute left-48 cursor-pointer max-h-48 overflow-hidden overflow-y-auto ${
                      index == 0 && "top-0"
                    } ${index == 1 && "top-16"} ${index == 2 && "top-24"} ${index == 3 && "top-36"} ${
                      index == 4 && "top-48"
                    }`}
                  >
                    {option.submenu.map((submenu, subIndex) => (
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
                              checked={dataFilterResult[option.parameter]?.includes(submenu.value) || false}
                              onChange={() => handleOnClickOption(submenu, option.type, option.parameter)}
                            />
                            <p
                              className={`text-sm ${
                                dataFilterResult[option.parameter]?.includes(submenu.value)
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
                    ))}
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

export default FilterDropDown;
