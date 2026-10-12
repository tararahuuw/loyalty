import React, { useState, useRef, useEffect } from "react";
import { CustomDatePicker, EmptyData, TextInput } from "sprint-asia-custom-component";
import CustomFieldNumber from "../CustomFieldNumber";
import { useDisclosure } from "prezent/useDisclosure";
import FilterCheckboxDropdownParameter from "../FilterCheckboxDropdownParameter";
import ModalNumberParameter from "../ModalNumberParameter";
import CustomDateTimePicker from "../CustomDateTimePicker/CustomDateTimePicker";
import moment from "moment";
import DropDownStore from "../DropDownStore/DropDownStore";

const CustomTablePointRules = ({ formik, isEdited = true }) => {
  const parentRef = useRef(null);
  const [currentNameParameter, setCurrentNameParameter] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]);

  const closeAllDropdowns = () => {
    setOpenDropdowns([]);
  };
  const { isOpen: numberModalIsOpen, toggle: toggleNumberModal } = useDisclosure(false);
  const [currentData, setCurrentData] = useState({ minimum: 0, maximum: 0, index: "", isException: false });

  function handleDeleteParameter(id) {
    formik.setFieldValue(
      "param",
      formik.values.param.filter((param) => param.id !== id)
    );
  }

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      closeAllDropdowns();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    parentRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      parentRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div ref={parentRef} className="w-full overflow-x-auto">
      <>
        {isEdited ? (
          formik?.values?.param && formik?.values?.param?.length > 0 ? (
            <div className="flex w-max items-stretch">
              {formik?.values?.param?.map((values, index) => {
                const isSingleItem = formik?.values?.param?.length === 1;
                return (
                  <div
                    className={`w-96 flex flex-col border border-neutral40 border-t border-b border-l ${
                      isSingleItem
                        ? "rounded-md"
                        : index === 0
                        ? "rounded-l-md"
                        : index === formik.values.param.length - 1
                        ? "rounded-r-md"
                        : ""
                    }`}
                    key={values.id}
                  >
                    <div
                      className={`bg-neutral20 w-full flex justify-between items-center border-b border-neutral40
                                    ${
                                      isSingleItem
                                        ? "rounded-tl-md rounded-tr-md"
                                        : index === 0
                                        ? "rounded-tl-md"
                                        : index === formik.values.param.length - 1
                                        ? "rounded-tr-md"
                                        : ""
                                    }`}
                    >
                      <p className="text-sm text-neutral300 py-2 px-4">
                        {values.parameterName === "Time" ? "Date Time" : values.parameterName}
                      </p>
                      {isEdited && (
                        <p
                          className="text-sm text-neutral300 py-2 px-4 cursor-pointer"
                          onClick={() => handleDeleteParameter(values.id)}
                        >
                          x
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex-1 flex flex-col justify-center w-full bg-white 
                                    ${
                                      isSingleItem
                                        ? "rounded-bl-md rounded-br-md"
                                        : index === 0
                                        ? "rounded-bl-md"
                                        : index === formik.values.param.length - 1
                                        ? "rounded-br-md"
                                        : ""
                                    }`}
                    >
                      {/* Parameter Date Time */}
                      {values?.type === "Date" && (
                        <div className="w-full px-4 py-2">
                          <CustomDateTimePicker
                            parentRef={parentRef}
                            value={[
                              values.value.startDate,
                              values.value.endDate,
                              values.value.isEndDate,
                              values.value.isIncludeTime,
                            ]}
                            onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                              formik.setFieldValue(
                                `param[${index}].value.startDate`,
                                startDate
                                  ? moment.utc(startDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD")
                                  : null
                              );
                              formik.setFieldValue(
                                `param[${index}].value.endDate`,
                                endDate
                                  ? moment.utc(endDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD")
                                  : null
                              );
                              formik.setFieldValue(`param[${index}].value.isEndDate`, isEndDate);
                              formik.setFieldValue(`param[${index}].value.isIncludeTime`, isIncludeTime);

                              if (!startDate && (!endDate || !isEndDate)) {
                                formik.setFieldValue(`param[${index}].errorValue`, "Date time is Required");
                              } else if (isEndDate && !endDate) {
                                formik.setFieldValue(`param[${index}].errorValue`, "End date is Required");
                              } else {
                                formik.setFieldValue(`param[${index}].errorValue`, "");
                              }
                            }}
                            footer={values.errorValue}
                            mode={values.errorValue ? "danger" : "default"}
                          />
                        </div>
                      )}

                      {/* Parameter Text */}
                      {values?.type === "Text" && (
                        <div className="w-full px-4 py-2">
                          <TextInput
                            value={values.value.text}
                            isRequired
                            onChangeInput={(e) => {
                              formik.setFieldValue(`param[${index}].value.text`, e.target.value);
                              if (values.value.text) {
                                formik.setFieldValue(`param[${index}].errorValue`, "");
                              } else {
                                formik.setFieldValue(
                                  `param[${index}].errorValue`,
                                  `${values.parameterName} is required`
                                );
                              }
                            }}
                            footer={values.errorValue}
                            mode={values.errorValue ? "danger" : "default"}
                          />
                        </div>
                      )}

                      {/* Parameter Number */}
                      {values?.type === "Number" && values?.parameterName !== "Amount" && (
                        <div className="w-full px-4 py-2">
                          <CustomFieldNumber
                            min={values.value.min}
                            max={values.value.max}
                            onClick={() => {
                              toggleNumberModal();
                              setCurrentNameParameter(values?.parameterName);
                              setCurrentData({
                                minimum: values.value.min,
                                maximum: values.value.max,
                                index: index,
                                isException: false,
                              });
                            }}
                            footer={values.errorValue}
                            mode={values.errorValue ? "danger" : "default"}
                          />
                        </div>
                      )}

                      {/* Parameter Amount */}
                      {values?.type === "Number" && values?.parameterName === "Amount" && (
                        <div className="w-full px-4 py-2">
                          <CustomFieldNumber
                            min={values.value.min}
                            max={values.value.max}
                            additionalWord={" Rp"}
                            onClick={() => {
                              toggleNumberModal();
                              setCurrentNameParameter(values?.parameterName);
                              setCurrentData({
                                minimum: values.value.min,
                                maximum: values.value.max,
                                index: index,
                                isException: false,
                              });
                            }}
                            footer={values.errorValue}
                            mode={values.errorValue ? "danger" : "default"}
                          />
                        </div>
                      )}

                      {values?.parameterName == "Store" && (
                        <DropDownStore
                          parentRef={parentRef}
                          onChange={(stores) => {
                            formik.setFieldValue(`param[${index}].value.status`, stores);
                            if (stores.length) {
                              formik.setFieldValue(`param[${index}].errorValue`, "");
                            } else {
                              formik.setFieldValue(`param[${index}].errorValue`, `Store is required`);
                            }
                          }}
                          stores={formik?.values?.parameters
                            ?.find((item) => item.parameterName === "Store" && item.id === values.id)
                            ?.status?.map((val) => ({
                              option: `ID: ${val.code} / ${val.value} - ${val.district}`,
                              value: val.id,
                              province: val.province,
                              city: val.city,
                              district: val.district,
                            }))}
                          footer={values.errorValue}
                          mode={values.errorValue ? "danger" : "default"}
                        />
                      )}

                      {/* Parameter Status */}
                      {values?.type === "Status" && values?.parameterName !== "Store" && (
                        <div className="w-full px-4 py-2">
                          <FilterCheckboxDropdownParameter
                            formik={formik}
                            type={"Main"}
                            key={index}
                            parentRef={parentRef}
                            closeAllDropdowns={closeAllDropdowns}
                            buttonText={values?.parameterName}
                            options={formik?.values?.parameters
                              ?.find((item) => item.id === values.id)
                              ?.status?.map(({ value, id, code }) => ({
                                option: values?.parameterName === "Product" ? `SKU: ${code} / ${value}` : value,
                                value: id,
                              }))}
                            currentValue={values.value.status?.map(({ value, code, idStatus, option }) => ({
                              option: option
                                ? option
                                : values?.parameterName === "Product"
                                ? `SKU: ${code} / ${value}`
                                : value,
                              value: idStatus ? idStatus : value,
                            }))}
                            selectAll
                            onSelect={(e) => {
                              formik.setFieldValue(`param[${index}].value.status`, e);
                              if (e.length > 0) {
                                formik.setFieldValue(`param[${index}].errorValue`, "");
                              } else {
                                formik.setFieldValue(
                                  `param[${index}].errorValue`,
                                  `${values.parameterName} is required`
                                );
                              }
                            }}
                            footer={values.errorValue}
                            mode={values.errorValue ? "danger" : "default"}
                          />
                        </div>
                      )}

                      {/* Line Dots */}
                      <hr
                        className={`${
                          formik.values.exceptionRule &&
                          values.parameterName !== "Amount" &&
                          values.parameterName !== "Time"
                            ? "border-neutral300"
                            : "border-white"
                        } border-dashed mx-4`}
                      />

                      {/* Exception Text */}
                      {formik.values.exceptionRule && values?.type === "Text" && (
                        <div className="w-full px-4 py-2">
                          <TextInput
                            value={values.exception.text}
                            isRequired
                            onChangeInput={(e) => {
                              formik.setFieldValue(`param[${index}].exception.text`, e.target.value);
                            }}
                          />
                        </div>
                      )}

                      {/* Exception Number */}
                      {formik.values.exceptionRule &&
                        values?.type === "Number" &&
                        values?.parameterName !== "Amount" && (
                          <div className="w-full px-4 py-2">
                            <CustomFieldNumber
                              min={values.exception.min}
                              max={values.exception.max}
                              onClick={() => {
                                toggleNumberModal();
                                setCurrentNameParameter(values?.parameterName);
                                setCurrentData({
                                  minimum: values.exception.min,
                                  maximum: values.exception.max,
                                  index: index,
                                  isException: true,
                                });
                              }}
                            />
                          </div>
                        )}

                      {/* Exception Status */}
                      {formik.values.exceptionRule && values?.type === "Status" && (
                        <div className="w-full px-4 py-2">
                          <FilterCheckboxDropdownParameter
                            formik={formik}
                            type={"Exception"}
                            key={index}
                            parentRef={parentRef}
                            closeAllDropdowns={closeAllDropdowns}
                            buttonText={values?.parameterName}
                            options={formik?.values?.parameters
                              ?.find((item) => item.id === values.id)
                              ?.status?.map(({ value, id, code }) => ({
                                option:
                                  values?.parameterName === "Store"
                                    ? `ID: ${code} / ${value}`
                                    : values?.parameterName === "Product"
                                    ? `SKU: ${code} / ${value}`
                                    : value,
                                value: id,
                              }))}
                            currentValue={values.exception.status?.map(({ value, code, idStatus, option }) => ({
                              option: option
                                ? option
                                : values?.parameterName === "Store"
                                ? `ID: ${code} / ${value}`
                                : values?.parameterName === "Product"
                                ? `SKU: ${code} / ${value}`
                                : value,
                              value: idStatus ? idStatus : value,
                            }))}
                            selectAll
                            onSelect={(e) => formik.setFieldValue(`param[${index}].exception.status`, e)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full">
              <div
                className={`bg-neutral20 w-full border border-neutral40 flex justify-between items-center rounded-t-md`}
              >
                <p className="text-sm text-neutral20 py-2 px-4">Empty Data</p>
              </div>
              <div
                className={`bg-white w-full border border-neutral40 flex justify-between items-center rounded-b-md py-1`}
              >
                <EmptyData />
              </div>
            </div>
          )
        ) : formik?.values?.param && formik?.values?.param?.length > 0 ? (
          <div className="flex w-max items-stretch">
            {formik?.values?.param.map((values, index) => {
              const isSingleItem = formik?.values?.param.length === 1;
              return (
                <div
                  className={`w-96 flex flex-col border border-neutral40 border-t border-b border-l ${
                    isSingleItem
                      ? "rounded-md"
                      : index === 0
                      ? "rounded-l-md"
                      : index === formik.values?.param.length - 1
                      ? "rounded-r-md"
                      : ""
                  }`}
                  key={values.id}
                >
                  <div
                    className={`bg-neutral20 w-full flex justify-between items-center border-b border-neutral40
                                    ${
                                      isSingleItem
                                        ? "rounded-tl-md rounded-tr-md"
                                        : index === 0
                                        ? "rounded-tl-md"
                                        : index === formik.values?.param.length - 1
                                        ? "rounded-tr-md"
                                        : ""
                                    }`}
                  >
                    <p className="text-sm text-neutral300 py-2 px-4">{values?.parameterName || "-"}</p>
                  </div>
                  <div
                    className={`flex-1 flex flex-col justify-center w-full bg-white
                                    ${
                                      isSingleItem
                                        ? "rounded-bl-md rounded-br-md"
                                        : index === 0
                                        ? "rounded-bl-md"
                                        : index === formik.values?.param.length - 1
                                        ? "rounded-br-md"
                                        : ""
                                    }`}
                  >
                    {/* Parameter Date Time */}
                    {values?.type === "Date" && (
                      <div className="w-full px-4 py-2">
                        <CustomDateTimePicker
                          parentRef={parentRef}
                          value={[
                            values.value.startDate,
                            values.value.endDate,
                            values.value.isEndDate,
                            values.value.isIncludeTime,
                          ]}
                          mode="disable"
                        />
                      </div>
                    )}

                    {/* Parameter Text */}
                    {values?.type === "Text" && (
                      <div className="w-full px-4 py-2">
                        <p>{values.value.text || "-"}</p>
                      </div>
                    )}

                    {/* Parameter Number */}
                    {values?.type === "Number" && values?.parameterName !== "Amount" && (
                      <div className="w-full px-4 py-2">
                        <p>
                          {values.value.min === 0 && values.value.max === null
                            ? "-"
                            : values.value.max !== null
                            ? `Min ${values?.value?.min ? values.value.min.toLocaleString() : 0} - Max ${
                                values.value.max ? values.value.max.toLocaleString() : 0
                              }`
                            : `Min ${values?.value?.min ? values.value.min.toLocaleString() : 0}`}
                        </p>
                      </div>
                    )}

                    {/* Parameter Amount */}
                    {values?.type === "Number" && values?.parameterName === "Amount" && (
                      <div className="w-full px-4 py-2">
                        <p>
                          {values.value.min === 0 && values.value.max === null
                            ? "-"
                            : values.value.max !== null
                            ? `Min Rp${values?.value?.min ? values.value.min.toLocaleString() : 0} - Max Rp${
                                values.value.max ? values.value.max.toLocaleString() : 0
                              }`
                            : `Minimum Rp${values?.value?.min ? values.value.min.toLocaleString() : 0}`}
                        </p>
                      </div>
                    )}

                    {/* Parameter Store */}
                    {values?.parameterName == "Store" && (
                      <DropDownStore
                        parentRef={parentRef}
                        onChange={(stores) => {
                          formik.setFieldValue(`param[${index}].value.status`, stores);
                          if (stores.length) {
                            formik.setFieldValue(`param[${index}].errorValue`, "");
                          } else {
                            formik.setFieldValue(`param[${index}].errorValue`, `Store is required`);
                          }
                        }}
                        stores={formik?.values?.parameters
                          ?.find((item) => item.parameterName === "Store" && item.id === values.id)
                          ?.status?.map((val) => ({
                            option: `ID: ${val.code} / ${val.value} - ${val.district}`,
                            value: val.id,
                            province: val.province,
                            city: val.city,
                            district: val.district,
                          }))}
                        footer={values.errorValue}
                        mode={values.errorValue ? "danger" : "default"}
                      />
                    )}

                    {/* Parameter Status */}
                    {values?.type === "Status" && values?.type !== "Store" && (
                      <div className="w-full px-4 py-2">
                        {values?.value?.status && values?.value?.status?.length > 0 ? (
                          <FilterCheckboxDropdownParameter
                            formik={formik}
                            type={"Main"}
                            key={index}
                            parentRef={parentRef}
                            closeAllDropdowns={closeAllDropdowns}
                            buttonText={values?.parameterName}
                            options={formik?.values?.parameters
                              ?.find((item) => item.id === values.id)
                              ?.status?.map(({ value, id, code }) => ({
                                option:
                                  values?.parameterName === "Store"
                                    ? `ID: ${code} / ${value}`
                                    : values?.parameterName === "Product"
                                    ? `SKU: ${code} / ${value}`
                                    : value,
                                value: id,
                              }))}
                            currentValue={values.value.status?.map(({ value, code, idStatus, option }) => ({
                              option: option
                                ? option
                                : values?.parameterName === "Store"
                                ? `ID: ${code} / ${value}`
                                : values?.parameterName === "Product"
                                ? `SKU: ${code} / ${value}`
                                : value,
                              value: idStatus ? idStatus : value,
                            }))}
                            isEdited={false}
                            selectAll
                            onSelect={(e) => formik.setFieldValue(`param[${index}].value.status`, e)}
                          />
                        ) : (
                          <div className="w-full">
                            <p>-</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Line Dots */}
                    <hr
                      className={`${
                        formik.values.exceptionRule &&
                        values.parameterName !== "Amount" &&
                        values.parameterName !== "Time"
                          ? "border-neutral300"
                          : "border-white"
                      } border-dashed mx-4`}
                    />

                    {/* Exception Text */}
                    {formik.values?.exceptionRule && values?.type === "Text" && (
                      <div className="w-full px-4 py-2">
                        <p>{values.exception.text || "-"}</p>
                      </div>
                    )}

                    {/* Exception Number */}
                    {formik.values?.exceptionRule &&
                      values?.type === "Number" &&
                      values?.parameterName !== "Amount" && (
                        <div className="w-full px-4 py-2">
                          <p>
                            {values.exception.min === 0 && values.exception.max === null
                              ? "-"
                              : values.exception.max !== null
                              ? `Min ${values.exception.min ? values.exception.min.toLocaleString() : 0} - Max ${
                                  values.exception.max ? values.exception.max.toLocaleString() : 0
                                }`
                              : `Min ${values.exception.min ? values.exception.min.toLocaleString() : 0}`}
                          </p>
                        </div>
                      )}

                    {/* Exception Status */}
                    {formik.values?.exceptionRule && values?.type === "Status" && (
                      <div className="w-full px-4 py-2">
                        {values?.exception?.status && values?.exception?.status?.length > 0 ? (
                          <FilterCheckboxDropdownParameter
                            formik={formik}
                            type={"Exception"}
                            key={index}
                            parentRef={parentRef}
                            closeAllDropdowns={closeAllDropdowns}
                            buttonText={values?.parameterName}
                            options={formik?.values?.parameters
                              ?.find((item) => item.id === values.id)
                              ?.status?.map(({ value, id, code }) => ({
                                option:
                                  values?.parameterName === "Store"
                                    ? `ID: ${code} / ${value}`
                                    : values?.parameterName === "Product"
                                    ? `SKU: ${code} / ${value}`
                                    : value,
                                value: id,
                              }))}
                            currentValue={values.exception.status?.map(({ value, code, idStatus, option }) => ({
                              option: option
                                ? option
                                : values?.parameterName === "Store"
                                ? `ID: ${code} / ${value}`
                                : values?.parameterName === "Product"
                                ? `SKU: ${code} / ${value}`
                                : value,
                              value: idStatus ? idStatus : value,
                            }))}
                            isEdited={false}
                            selectAll
                            onSelect={(e) => formik.setFieldValue(`param[${index}].exception.status`, e)}
                          />
                        ) : (
                          <div className="w-full px-4 py-2">
                            <p>-</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full">
            <div
              className={`bg-neutral20 w-full border border-neutral40 flex justify-between items-center rounded-t-md`}
            >
              <p className="text-sm text-neutral20 py-2 px-4">Empty Data</p>
            </div>
            <div
              className={`bg-white w-full border border-neutral40 flex justify-between items-center rounded-b-md py-1`}
            >
              <EmptyData />
            </div>
          </div>
        )}
      </>
      <ModalNumberParameter
        isOpen={numberModalIsOpen}
        onClose={toggleNumberModal}
        title={currentNameParameter}
        currentData={currentData}
        formik={formik}
      />
    </div>
  );
};

export default CustomTablePointRules;
