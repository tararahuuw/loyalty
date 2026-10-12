import React, { useState } from "react";
import TextArea from "../TextArea/TextArea";
import { CaretRight, Info } from "@phosphor-icons/react";

const LandingPageAddressInput = ({ labels = [], isRequired, onClickAddress, formik }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <>
      {labels.map((label, idx) => {
        if (!idx) {
          return (
            <div className="w-full" key={idx}>
              {label && (
                <div className="flex">
                  <span className="text-sm font-normal text-black mb-1">
                    {label}
                    {isRequired && <span className="text-sm font-normal text-danger500 ml-1">*</span>}
                  </span>
                </div>
              )}
              <div className="relative">
                <input
                  className={`py-2.5 pr-8 px-4 w-full font-normal text-sm cursor-pointer text-neutral300 rounded-md border
                  ${
                    !formik.values["Province, City, District, Postal Code"] &&
                    !formik.errors["Province, City, District, Postal Code"] &&
                    "bg-neutral20 border-neutral50 focus:outline-2 outline-primary500"
                  }
                        ${
                          formik.values["Province, City, District, Postal Code"] &&
                          !formik.errors["Province, City, District, Postal Code"] &&
                          "bg-neutral20 border-black focus:outline-2 outline-primary500"
                        }
                        ${
                          isFocused &&
                          !formik.errors["Province, City, District, Postal Code"] &&
                          "bg-neutral20 border-primary500"
                        }
                        ${
                          formik.errors["Province, City, District, Postal Code"] &&
                          "bg-danger50 border-danger500 focus:outline-2 outline-danger500"
                        }`}
                  placeholder="Choose"
                  value={formik.values["Province, City, District, Postal Code"]}
                  onClick={onClickAddress}
                  onChange={(e) => e.preventDefault()}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />

                <CaretRight className="absolute right-3 top-3 text-neutral80 cursor-pointer" />
              </div>

              <div className="mt-1 flex flex-row items-center justify-between">
                {formik.errors["Province, City, District, Postal Code"] &&
                  (formik.errors["Province, City, District, Postal Code"] ? (
                    <div className="flex">
                      <div>
                        <Info size={16} className="text-danger500" />
                      </div>
                      <p className="text-danger500 text-xs ml-1">
                        {formik.errors["Province, City, District, Postal Code"]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-black text-xs">{formik.errors["Province, City, District, Postal Code"]}</p>
                  ))}
              </div>
            </div>
          );
        } else if (idx == 1) {
          return (
            <TextArea
              key={idx}
              title={label}
              isRequired={isRequired}
              value={formik.values["Street Name, Building, House No.".replace(/\./g, "_")]}
              onChange={(e) =>
                formik.setFieldValue("Street Name, Building, House No.".replace(/\./g, "_"), e.target.value)
              }
              placeholder="Input Your Address"
              lengthChecker={false}
              mode={formik.errors["Street Name, Building, House No.".replace(/\./g, "_")] ? "danger" : "default"}
              footer={formik.errors["Street Name, Building, House No.".replace(/\./g, "_")]}
            />
          );
        } else {
          return (
            <TextArea
              key={idx}
              title={label}
              isRequired={isRequired}
              value={formik.values["Other Details (e.g Block / Unit No, Landmarks)".replace(/\./g, "_")]}
              onChange={(e) => {
                formik.setFieldValue(
                  "Other Details (e.g Block / Unit No, Landmarks)".replace(/\./g, "_"),
                  e.target.value
                );
              }}
              placeholder="Input Your Details"
              lengthChecker={false}
              mode={
                formik.errors["Other Details (e.g Block / Unit No, Landmarks)".replace(/\./g, "_")]
                  ? "danger"
                  : "default"
              }
              footer={formik.errors["Other Details (e.g Block / Unit No, Landmarks)".replace(/\./g, "_")]}
            />
          );
        }
      })}
    </>
  );
};

export default LandingPageAddressInput;
