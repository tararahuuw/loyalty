import React, { useState } from "react";

import { Square, RadioButton, CheckSquare, Info, Circle } from "@phosphor-icons/react";
import { useEffect } from "react";

const LandingPageSelectComponent = ({
  className,
  title,
  isRequired,
  mode = "default",
  options = [],
  multipleSelect,
  onChange = () => {},
  footer,
  value,
}) => {
  const [selected, setSelected] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const onSelectHandler = (value) => {
    onChange(value);
    setSelected(value);
  };

  const handleAddOption = (option) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = [...prevOptions, option];
      onChange(updatedOptions.length === 0 ? "" : JSON.stringify(updatedOptions));
      return updatedOptions;
    });
  };

  const removeOption = (option) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter((item) => item !== option);
      onChange(updatedOptions.length === 0 ? "" : JSON.stringify(updatedOptions));
      return updatedOptions;
    });
  };

  useEffect(() => {
    if (!multipleSelect) {
      if (value) {
        setSelected(value);
      } else {
        setSelected("");
      }
    } else {
      if (value) {
        setSelectedOptions(JSON.parse(value));
      } else {
        setSelectedOptions([]);
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {title && (
        <div className="flex">
          <p className="text-sm font-normal text-black mb-1">{title}</p>
          {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
        </div>
      )}

      <div
        className={`border rounded-md text-neutral300 p-3 flex flex-col
       ${
         (!selected || !selectedOptions.length) &&
         mode === "default" &&
         "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"
       }
       ${
         selected &&
         selectedOptions.length &&
         mode === "default" &&
         "bg-neutral20 border-black focus:outline-2 outline-primary500"
       }
       ${mode === "danger" && "bg-danger50 border-danger500 focus:outline-2 outline-danger500"}
       ${mode === "disable" && "bg-neutral30 border-neutral50"} w-full text-sm
       `}
      >
        {options.map((option, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="radio"
              value={option}
              id={option}
              checked={!multipleSelect ? selected === option : selectedOptions.includes(option)}
              className="self-start hidden"
              onChange={() => {
                !multipleSelect ? onSelectHandler(option) : () => {};
              }}
            />

            {!multipleSelect ? (
              <label
                htmlFor={option}
                className={`radio-label ${selected === option ? "checked" : ""}`}
                style={{ marginTop: 3 }}
              >
                {selected === option ? (
                  <RadioButton weight="fill" className="text-primary500 cursor-pointer" />
                ) : (
                  <Circle className="cursor-pointer" />
                )}
              </label>
            ) : (
              <label
                htmlFor={option}
                className={`radio-label ${selected === option ? "checked" : ""}`}
                style={{ marginTop: 3 }}
              >
                {selectedOptions.includes(option) ? (
                  <a onClick={() => removeOption(option)}>
                    <CheckSquare weight="fill" className="text-primary500 cursor-pointer" />
                  </a>
                ) : (
                  <a onClick={() => handleAddOption(option)}>
                    <Square className="cursor-pointer" />
                  </a>
                )}
              </label>
            )}

            <p className="text-sm" style={{ wordBreak: "break-all" }}>
              {option}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-1 flex flex-row items-center justify-between">
        {footer &&
          (mode === "danger" ? (
            <div className="flex">
              <div>
                <Info size={16} className="text-danger500" />
              </div>
              <p className="text-danger500 text-xs ml-1">{footer}</p>
            </div>
          ) : (
            <p className="text-black text-xs">{footer}</p>
          ))}
      </div>
    </div>
  );
};

export default LandingPageSelectComponent;
