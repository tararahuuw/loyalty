import React, { useRef, useState, useEffect } from "react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import DropDownText from "../../DropDownText/DropDownText";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import { MedalIcon } from "@phosphor-icons/react";
import DropDownStore from "../../DropDownStore/DropDownStore";
import {
  GetAllProvinceStore,
  GetAllStores,
  PostAllCityStore,
  PostAllDistrictStores,
} from "../../../service/storemanagement/endpoint";
import { useFetch } from "prezent/useFetch";
import TextInput from "prezent/TextInput";
import moment from "moment";

const SampleTransaction = ({
  tiers = [],
  method,
  customerName,
  customerPhoneNumber,
  customerEmail,
  formik,
  handleCalculatePoints,
  calculatedPoints = 0,
  isException,
  parameters = [],
  setCalendarIsOpen,
  maxDate,
  minDate,
}) => {
  const parentRef = useRef();
  const [dataFilterValue, setDataFilterValue] = useState({ province: [], city: [], district: [], store: [] });
  const { data: provincesValue } = useFetch(GetAllProvinceStore, "provincesValue", [], null);
  const { data: citiesValue } = useFetch(
    dataFilterValue?.province?.length > 0 && dataFilterValue?.province?.length && PostAllCityStore,
    "citiesValue",
    [dataFilterValue?.province?.length],
    { province: dataFilterValue?.province },
  );
  const { data: districtsValue } = useFetch(
    dataFilterValue?.city?.length > 0 && dataFilterValue?.city?.length && PostAllDistrictStores,
    "districtsValue",
    [dataFilterValue?.city?.length],
    { city: dataFilterValue?.city },
  );
  const { data: storesValue } = useFetch(dataFilterValue.province.length && GetAllStores, "all-stores-value", [], {
    province: dataFilterValue.province,
    city: dataFilterValue.city,
    district: dataFilterValue.district,
  });

  const setSelectedFilterOptionsValue = (options, idx) => {
    setDataFilterValue(options);

    const selectedStoreId = options.store?.[0]?.id;

    if (selectedStoreId) {
      const updatedParameters = formik.values.parameters.map((param) => {
        if (param.name === "Store") {
          return {
            ...param,
            value: {
              ...param.value,
              option: [selectedStoreId],
            },
          };
        }
        return param;
      });

      formik.setFieldValue("parameters", updatedParameters);
    } else {
      const clearedParameters = formik.values.parameters.map((param) => {
        if (param.name === "Store") {
          return {
            ...param,
            value: {
              ...param.value,
              option: [],
            },
          };
        }
        return param;
      });

      formik.setFieldValue("parameters", clearedParameters);
    }

    formik.setFieldTouched(`parameters[${idx}].value.option`, true, false);
  };

  const handleReset = () => {
    formik.setFieldValue(
      "parameters",
      parameters
        .filter((val) => val.settingParameterType !== "datetime")
        .map((parameter) => ({
          id: parameter.id,
          name: parameter.settingParameterName,
          type: parameter.settingParameterType,
          options: parameter.options || [],
          value: {
            number: null,
            text: null,
            datetime: null,
            option: [],
          },
        })),
      false,
    );
    formik.setFieldValue("tierLevelId", "", false);

    setDataFilterValue({ province: [], city: [], district: [], store: [] });
  };

  useEffect(() => {
    formik.setFieldValue(
      "parameters",
      formik.values.parameters.map((param) => {
        if (param.type === "datetime") {
          return {
            ...param,
            value: {
              ...param.value,
              datetime: moment(formik.values.transactionDate).format("YYYY-MM-DD HH:mm"),
            },
          };
        }
        return param;
      }),
      false,
    );
  }, [formik.values.transactionDate]);

  return (
    <div className="mb-2 bg-white rounded-lg py-5 px-6 shadow-md flex flex-col gap-4">
      <p className="text-lg font-semibold leading-6 text-left border-b border-neutral40 pb-2">
        Sample Transaction Form
      </p>

      <div className="grid grid-cols-3 gap-2">
        <TextInput title="Customer Name" mode="disable" onChangeInput={() => {}} value={customerName} />
        <TextInput
          title="Phone Number"
          mode="disable"
          onChangeInput={() => {}}
          value={customerPhoneNumber?.replace(/^\+/, "")}
        />
        <TextInput title="Email" mode="disable" onChangeInput={() => {}} value={customerEmail} />

        {method === "all" ? null : (
          <DropDownText
            parentRef={parentRef}
            title="Tier Level"
            onSelect={(e) => {
              formik.setFieldValue("tierLevelId", e.value);
              formik.setFieldTouched("tierLevelId", true, false);
            }}
            isEdited
            placeholder="Select tier level"
            options={tiers.map((item) => ({
              option: item.tierName,
              value: item.id,
            }))}
            multiselect={false}
            currentOption={[formik.values.tierLevelId]}
            footer={
              (formik.touched.tierLevelId || formik.submitCount > 0) && formik.errors.tierLevelId
                ? formik.errors.tierLevelId
                : null
            }
            mode={
              (formik.touched.tierLevelId || formik.submitCount > 0) && formik.errors.tierLevelId ? "danger" : "default"
            }
          />
        )}

        <CustomDateTimePicker
          title="Transaction Date"
          isRange={false}
          value={[formik.values.transactionDate, null, false, true]}
          onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
            formik.setFieldValue("transactionDate", startDate);
            formik.setFieldTouched("transactionDate", true, false);
          }}
          disableToggles={true}
          footer={
            (formik.touched.transactionDate || formik.submitCount > 0) && formik.errors.transactionDate
              ? formik.errors.transactionDate
              : null
          }
          mode={
            (formik.touched.transactionDate || formik.submitCount > 0) && formik.errors.transactionDate
              ? "danger"
              : "default"
          }
          setIsOpen={setCalendarIsOpen}
          maxDate={maxDate}
          minDate={minDate}
        />

        {formik.values.parameters.map((parameter, idx) => {
          const formatNumber = (val) => {
            if (val === "" || val === null) return "";
            return new Intl.NumberFormat("id-ID").format(Number(val));
          };

          if (parameter.name === "Store") {
            return (
              <DropDownStore
                title="Store"
                parentRef={parentRef}
                options={[
                  {
                    menu: "Province",
                    parameter: "province",
                    submenu:
                      provincesValue?.data?.map((city) => ({
                        option: city.name,
                        value: city.code,
                      })) || [],
                    type: "checkbox",
                  },
                  {
                    menu: "City / Regencies",
                    parameter: "city",
                    submenu:
                      citiesValue?.data?.map((city) => ({
                        option: city.name,
                        value: city.code,
                      })) || [],
                    type: "checkbox",
                  },
                  {
                    menu: "District",
                    parameter: "district",
                    submenu:
                      districtsValue?.data?.map((district) => ({
                        option: district.name,
                        value: district.code,
                      })) || [],
                    type: "checkbox",
                  },
                  {
                    menu: "Store",
                    parameter: "store",
                    submenu:
                      storesValue?.data?.map((store) => ({
                        option: store.name,
                        value: store.code,
                        raw: store,
                      })) || [],
                    type: "checkbox",
                  },
                ]}
                dataFilterResult={dataFilterValue}
                setDataFilterResult={(options) => setSelectedFilterOptionsValue(options, idx)}
                footer={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? formik.errors.parameters[idx].value.option
                    : null
                }
                mode={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? "danger"
                    : "default"
                }
                multiselect={false}
              />
            );
          } else if (parameter.name === "Product") {
            return (
              <DropDownText
                title={parameter.name}
                parentRef={parentRef}
                multiselect={true}
                options={parameter.options.map((option) => ({
                  option: option.label,
                  value: option.value,
                }))}
                onSelect={(items) => {
                  const updated = [...formik.values.parameters];

                  updated[idx] = {
                    ...updated[idx],
                    value: { ...updated[idx].value, option: items },
                  };

                  formik.setFieldValue("parameters", updated);
                  formik.setFieldTouched(`parameters[${idx}].value.option`, true, false);
                }}
                currentOption={parameter.value.option}
                isEdited
                placeholder={`Select ${parameter.name}`}
                footer={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? formik.errors.parameters[idx].value.option
                    : null
                }
                mode={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? "danger"
                    : "default"
                }
              />
            );
          } else if (parameter.type === "option") {
            return (
              <DropDownText
                title={parameter.name}
                parentRef={parentRef}
                multiselect={false}
                options={parameter.options.map((option) => ({
                  option: option.label,
                  value: option.value,
                }))}
                onSelect={(e) => {
                  const updated = [...formik.values.parameters];
                  updated[idx] = {
                    ...updated[idx],
                    value: { ...updated[idx].value, option: [e.value] },
                  };
                  formik.setFieldValue("parameters", updated);
                  formik.setFieldTouched(`parameters[${idx}].value.option`, true, false);
                }}
                currentOption={parameter.value.option}
                isEdited
                placeholder={`Select ${parameter.name}`}
                footer={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? formik.errors.parameters[idx].value.option
                    : null
                }
                mode={
                  (formik.touched.parameters?.[idx]?.value?.option || formik.submitCount > 0) &&
                  formik.errors.parameters?.[idx]?.value?.option
                    ? "danger"
                    : "default"
                }
              />
            );
          } else if (parameter.type === "datetime") {
            return null;
          } else {
            if (
              parameter.name === "Total Saving (Rp)" ||
              parameter.name === "Weight (kg)" ||
              parameter.name === "Transaction Amount (Rp)" ||
              parameter.name === "Distance (M)" ||
              parameter.name === "Distance (KM)" ||
              parameter.name === "Height (CM)" ||
              parameter.name === "Transaction Frequency"
            ) {
              return (
                <TextInput
                  title={parameter.name}
                  leftAdornment={
                    parameter.name === "Total Saving (Rp)" || parameter.name === "Transaction Amount (Rp)" ? (
                      <p className="text-xs">Rp</p>
                    ) : null
                  }
                  placeholder={`Input ${parameter.name}`}
                  value={formatNumber(parameter.value.number)}
                  onChangeInput={(e) => {
                    let val = e.target.value.replace(/\D/g, ""); // only digits
                    const updated = [...formik.values.parameters];
                    updated[idx] = {
                      ...updated[idx],
                      value: { ...updated[idx].value, number: val === "" ? null : Number(val) },
                    };
                    formik.setFieldValue("parameters", updated);
                    formik.setFieldTouched(`parameters[${idx}].value.number`, true, false);
                  }}
                  footer={
                    (formik.touched.parameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                    formik.errors.parameters?.[idx]?.value?.number
                      ? formik.errors.parameters[idx].value.number
                      : null
                  }
                  mode={
                    (formik.touched.parameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                    formik.errors.parameters?.[idx]?.value?.number
                      ? "danger"
                      : "default"
                  }
                />
              );
            } else {
              return (
                <TextInput
                  title={parameter.name}
                  placeholder={`Input ${parameter.name}`}
                  value={parameter.type === "number" ? formatNumber(parameter.value.number) : parameter.value.text}
                  onChangeInput={(e) => {
                    let val = e.target.value;
                    if (parameter.type === "number") {
                      val = val.replace(/\D/g, "");
                    }
                    const updated = [...formik.values.parameters];
                    updated[idx] = {
                      ...updated[idx],
                      value: {
                        ...updated[idx].value,
                        [parameter.type === "number" ? "number" : "text"]:
                          val === "" ? null : parameter.type === "number" ? Number(val) : val,
                      },
                    };
                    formik.setFieldValue("parameters", updated);
                    formik.setFieldTouched(
                      `parameters[${idx}].value.${parameter.type === "number" ? "number" : "text"}`,
                      true,
                      false,
                    );
                  }}
                  footer={
                    (formik.touched.parameters?.[idx]?.value?.[parameter.type === "number" ? "number" : "text"] ||
                      formik.submitCount > 0) &&
                    formik.errors.parameters?.[idx]?.value?.[parameter.type === "number" ? "number" : "text"]
                      ? formik.errors.parameters[idx].value[parameter.type === "number" ? "number" : "text"]
                      : null
                  }
                  mode={
                    (formik.touched.parameters?.[idx]?.value?.[parameter.type === "number" ? "number" : "text"] ||
                      formik.submitCount > 0) &&
                    formik.errors.parameters?.[idx]?.value?.[parameter.type === "number" ? "number" : "text"]
                      ? "danger"
                      : "default"
                  }
                />
              );
            }
          }
        })}
      </div>

      <div className="flex flex-col gap-4 bg-neutral20 rounded-md p-4">
        <div className="flex items-center gap-4 justify-end">
          <OutlineButton title="Reset" onClick={handleReset} />
          <PrimaryButton title="Calculate Point" onClick={handleCalculatePoints} />
        </div>
      </div>

      <div className="bg-primary50 flex justify-end rounded-md p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-10">
            <p className="italic text-neutral300 font-medium">Customer will earn</p>
            <p className="font-medium">{calculatedPoints.toLocaleString("id-ID")} points</p>
          </div>

          {calculatedPoints ? (
            <div
              className={`self-end rounded-full px-4 py-1 flex items-center gap-2 ${
                isException ? "bg-success50 text-success500" : "bg-neutral20 text-neutral300"
              }`}
            >
              <MedalIcon />
              <p>{isException ? "Special Earning Point" : "General Earning Point"}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SampleTransaction;
