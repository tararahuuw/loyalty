import React, { useRef, useEffect, useState } from "react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { XIcon, PlusIcon, MagnifyingGlassIcon, GearIcon, InfoIcon } from "@phosphor-icons/react";
import ToolTip from "prezent/ToolTip";
import { useDisclosure } from "prezent/useDisclosure";
import empty from "../../../../assets/images/logo_empty_box.png";
import DropDownStore from "../../../DropDownStore/DropDownStore";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import DropDownText from "../../../DropDownText/DropDownText";
import ModalParameter from "./ModalParameter";
import LoadingModal from "prezent/LoadingModal";
import { CreateNewParameter } from "../../../../service/parametermanagement/endpoint";
import moment from "moment";
import ResultModal from "prezent/ResultModal";
import TextInput from "prezent/TextInput";

const ParameterSection = ({
  formik,
  selectedParameters,
  setSelectedParameters,
  parameters,
  companyId,
  refetch,
  dataFilterValue,
  setSelectedFilterOptionsValue,
  dataFilterException,
  setSelectedFilterOptionsException,
  provincesValue,
  citiesValue,
  districtsValue,
  provincesException,
  citiesException,
  districtsException,
  storesValue,
  storesException,
}) => {
  const parentRef = useRef(null);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);

  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: addParameterIsOpen, toggle: toggleAddParameter } = useDisclosure();
  const { isOpen: parameterFormIsOpen, toggle: toggleParameterForm } = useDisclosure();
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1000);
    }, 250);
  };

  const removeSelectedParameter = (value) => {
    const filtered = selectedParameters.filter((item) => item.id !== value.id);
    setSelectedParameters(filtered);
  };

  const addSelectedParameters = (value) => {
    setSelectedParameters((prevState) => {
      if (prevState.some((item) => item.id === value.id)) {
        return prevState;
      } else {
        return [
          ...prevState,
          {
            ...value,
            option: value.option || [],
            value: {
              endDate:
                value.parameterName === "Date Time"
                  ? moment(formik.values.endDate).format("YYYY-MM-DD HH:mm") || ""
                  : "",
              isEndDate: value.parameterName === "Date Time" ? (formik.values.endDate ? true : false) : false,
              isIncludeTime: value.parameterName === "Date Time" ? true : false,
              number: 0,
              options: [],
              startDate:
                value.parameterName === "Date Time"
                  ? moment(formik.values.startDate).format("YYYY-MM-DD HH:mm") || ""
                  : "",
              text: "",
            },
            exception: {
              endDate: "",
              isEndDate: false,
              isIncludeTime: false,
              number: 0,
              options: [],
              startDate: "",
              text: "",
            },
          },
        ];
      }
    });
  };

  const addNewParameter = (value) => {
    handleCreateParameter(value);
  };

  const handleParameterChange = (idx, type, field, newValue, isStore) => {
    setSelectedParameters((prev) => {
      const updated = [...prev];
      const currentField = updated[idx][field];

      let newFieldValue = currentField; // default keep as is
      if (isStore) {
        newFieldValue = { ...currentField, options: newValue.map((store) => store.id) };
      } else {
        if (type === "text") {
          newFieldValue = { ...currentField, text: newValue };
        } else if (type === "number") {
          newFieldValue = { ...currentField, number: Number(newValue) };
        } else if (type === "option") {
          newFieldValue = {
            ...currentField,
            options: newValue,
          };
        }
      }

      updated[idx] = {
        ...updated[idx],
        [field]: newFieldValue,
      };

      return updated;
    });

    if (type === "option") {
      formik.setFieldTouched(`pointParameters[${idx}].${field}.options`, true, false);
    } else if (type === "text") {
      formik.setFieldTouched(`pointParameters[${idx}].${field}.text`, true, false);
    } else if (type === "number") {
      formik.setFieldTouched(`pointParameters[${idx}].${field}.number`, true, false);
    }
  };

  const handleTimeFrameChange = (idx, key, data) => {
    setSelectedParameters((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [key]: {
          ...updated[idx][key],
          startDate: data.isIncludeTime
            ? moment.utc(data.startDate).format("YYYY-MM-DD HH:mm")
            : moment.utc(data.startDate).format("YYYY-MM-DD"),
          endDate: data.endDate
            ? data.isIncludeTime
              ? moment.utc(data.endDate).format("YYYY-MM-DD HH:mm")
              : moment.utc(data.endDate).format("YYYY-MM-DD")
            : null,
          isEndDate: data.isEndDate,
          isIncludeTime: data.isIncludeTime,
        },
      };
      return updated;
    });
  };

  const handleCreateParameter = async (form) => {
    try {
      openLoading();
      toggleParameterForm();
      const response = await CreateNewParameter({ companyId, ...form });
      addSelectedParameters(response.data);
      refetch();
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully added");
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to adding parameter data at the moment. Please try again");
    }
  };

  const error = (formik.touched.pointParameters || formik.submitCount > 0) && formik.errors.pointParameters;

  // Watch "Value" store changes
  useEffect(() => {
    selectedParameters.forEach((param, idx) => {
      if (param.parameterName === "Store") {
        handleParameterChange(idx, "option", "value", dataFilterValue.store, true);
      }
      formik.setFieldTouched(`pointParameters[${idx}].value`, true, false);
    });
  }, [dataFilterValue.store]);

  // Watch "Exception" store changes
  useEffect(() => {
    selectedParameters.forEach((param, idx) => {
      if (param.parameterName === "Store") {
        handleParameterChange(idx, "option", "exception", dataFilterException.store, true);
      }
      formik.setFieldTouched(`pointParameters[${idx}].exception`, true, false);
    });
  }, [dataFilterException.store]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        toggleAddParameter();
      }
    };

    if (addParameterIsOpen) {
      document.addEventListener("mousedown", handleOutsideClick);

      // Dynamically check if dropdown should be displayed above or below
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 250; // estimate dropdown height or calculate it dynamically if needed
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      if (spaceBelow < dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [addParameterIsOpen]);

  // Handle change parameter time if campaign start/end period changes
  useEffect(() => {
    const datetimeParam = [...selectedParameters]
      .sort((a, b) => a.sequence - b.sequence) // sort by sequence
      .find((param) => param.type === "datetime");

    const datetimeIndex = selectedParameters.findIndex((param) => param.id === datetimeParam?.id);

    if (datetimeIndex !== -1) {
      handleTimeFrameChange(datetimeIndex, "value", {
        startDate: moment(formik.values.startDate).format("YYYY-MM-DD HH:mm"),
        endDate: moment(formik.values.endDate).format("YYYY-MM-DD HH:mm"),
        isEndDate: true,
        isIncludeTime: true,
      });
    }
  }, [formik.values.startDate, formik.values.endDate, selectedParameters?.length]);

  useEffect(() => {
    if (!addParameterIsOpen) {
      setSearchInput("");
    }
  }, [addParameterIsOpen]);

  return (
    <div className="flex flex-col w-full bg-neutral20 rounded-lg p-6 gap-4">
      <div className="flex items-center justify-between" ref={buttonRef}>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Parameter</p>
          <ToolTip
            id="point-parameter"
            message="Configure parameters and rules that control how points are calculated and awarded to customers. These settings define eligibility, point values, and conditions for earning points."
          />
        </div>

        <div className="relative">
          <OutlineButton
            title={
              <div className="flex items-center gap-2">
                <PlusIcon />
                <p>Add Parameter</p>
              </div>
            }
            onClick={toggleAddParameter}
            isActive={formik.values.pointProcessingMethod !== "upload point"}
          />

          {addParameterIsOpen && (
            <div
              ref={dropDownRef}
              className={`rounded-md border border-neutral40 shadow-md bg-white p-4 absolute top-12 right-0 flex flex-col gap-2 z-10 w-80`}
            >
              <div className="flex items-center gap-2">
                <TextInput
                  placeholder="Find Parameter"
                  leftAdornment={<MagnifyingGlassIcon className="text-neutral80" />}
                  onChangeInput={(e) => setSearchInput(e.target.value)}
                />
                <OutlineButton title={<GearIcon />} />
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-52">
                {parameters
                  ?.filter((parameter) => parameter.parameterName.toLowerCase().includes(searchInput.toLowerCase()))
                  ?.map((parameter, idx) => (
                    <a
                      key={idx}
                      className="hover:bg-neutral20 p-2 rounded-md text-sm font-normal cursor-pointer"
                      onClick={() => addSelectedParameters(parameter)}
                    >
                      {parameter.parameterName}
                    </a>
                  ))}
              </div>

              <div className="border-t border-neutral40 flex items-center justify-center pt-2">
                <PrimaryButton title="Create new parameter" type="full" onClick={toggleParameterForm} />
              </div>
            </div>
          )}
        </div>
      </div>

      {!selectedParameters.length ? (
        // empty state
        <div className="flex flex-col">
          <div
            className={`border ${
              error ? "border-danger500 bg-danger50" : "border-neutral40 bg-neutral30"
            } rounded-t-md h-10 flex`}
          ></div>
          <div
            className={`border border-t-0 ${
              error ? "border-danger500" : "border-neutral40"
            } rounded-b-md flex h-44 overflow-hidden`}
          >
            <div className={`flex flex-col justify-center items-center gap-2 w-full bg-white`}>
              <img src={empty} className="h-24 w-24" alt="empty" />
              <p className="font-semibold">No Data Available</p>
              <p className="font-normal text-neutral80">Sorry, There are no data to display at this time</p>
            </div>
          </div>

          {typeof error === "string" ? (
            <div className="flex items-center gap-1 mt-1">
              <InfoIcon size={16} className="text-danger500" />
              <p className="text-danger500 text-xs">{error}</p>
            </div>
          ) : null}
        </div>
      ) : (
        // parameter list
        <div className="flex w-full flex-nowrap border border-neutral40 rounded-t-md overflow-x-auto overflow-y-visible relative">
          {selectedParameters
            .sort((a, b) => a?.sequence - b?.sequence)
            .map((item, idx) => {
              const firstChild = idx === 0;
              const lastChild = idx === selectedParameters.length - 1;

              const formatNumber = (val) => {
                if (val === "" || val === null) return "";
                return new Intl.NumberFormat("id-ID").format(Number(val));
              };

              return (
                <div
                  key={idx}
                  className={`flex flex-col w-72 border-neutral40 ${
                    firstChild && selectedParameters.length === 1 && "border-r"
                  } ${firstChild ? "border-l-0" : lastChild ? "border-l border-r" : "border-l"}`}
                  style={{ minWidth: 288 }}
                >
                  <div className="bg-neutral30 border-neutral40 py-2 flex w-full">
                    <div className="flex items-center justify-between px-2 w-full">
                      <p className="uppercase text-sm">{item.parameterName}</p>
                      <a className="cursor-pointer" onClick={() => removeSelectedParameter(item)}>
                        <XIcon className="text-neutral80" />
                      </a>
                    </div>
                  </div>

                  {item.isMaster ? (
                    <>
                      {item.parameterName === "Product" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownText
                            title=""
                            itemName={item.parameterName}
                            parentRef={parentRef}
                            isEdited
                            placeholder={`Choose ${item.parameterName}`}
                            currentOption={item.value.options.map((option) => option.value || option)}
                            options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                            onSelect={(items) => {
                              handleParameterChange(idx, item.type, "value", items);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownText
                              title=""
                              itemName={item.parameterName}
                              parentRef={parentRef}
                              isEdited
                              placeholder={`Choose ${item.parameterName}`}
                              currentOption={item.exception.options.map((option) => option.value || option)}
                              options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                              onSelect={(items) => {
                                handleParameterChange(idx, item.type, "exception", items);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {item.parameterName === "Program" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownText
                            title=""
                            itemName={item.parameterName}
                            parentRef={parentRef}
                            isEdited
                            placeholder={`Choose ${item.parameterName}`}
                            currentOption={item.value.options.map((option) => option.value || option)}
                            options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                            onSelect={(items) => {
                              handleParameterChange(idx, item.type, "value", items);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownText
                              title=""
                              itemName={item.parameterName}
                              parentRef={parentRef}
                              isEdited
                              placeholder={`Choose ${item.parameterName}`}
                              currentOption={item.exception.options.map((option) => option.value || option)}
                              options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                              onSelect={(items) => {
                                handleParameterChange(idx, item.type, "exception", items);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {(item.parameterName === "Total Saving (Rp)" ||
                        item.parameterName === "Weight (kg)" ||
                        item.parameterName === "Transaction Amount (Rp)" ||
                        item.parameterName === "Transaction Frequency" ||
                        item.parameterName === "Distance (M)" ||
                        item.parameterName === "Distance (KM)" ||
                        item.parameterName === "Height (CM)") && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <TextInput
                            leftAdornment={
                              item.parameterName === "Total Saving (Rp)" ||
                              item.parameterName === "Transaction Amount (Rp)" ? (
                                <p className="text-xs text-neutral80">Rp</p>
                              ) : null
                            }
                            placeholder={`Input ${item.parameterName}`}
                            value={formatNumber(item.value.number)}
                            onChangeInput={(e) => {
                              let val = e.target.value;

                              if (item.type === "number") {
                                // remove non-digits before storing in state
                                val = val.replace(/\D/g, "");
                              }

                              handleParameterChange(idx, item.type, "value", val);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.number
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.number}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.number
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <TextInput
                              leftAdornment={
                                item.parameterName === "Total Saving (Rp)" ||
                                item.parameterName === "Transaction Amount (Rp)" ? (
                                  <p className="text-xs text-neutral80">Rp</p>
                                ) : null
                              }
                              placeholder={`Input ${item.parameterName}`}
                              value={formatNumber(item.exception.number)}
                              onChangeInput={(e) => {
                                let val = e.target.value;

                                if (item.type === "number") {
                                  // remove non-digits before storing in state
                                  val = val.replace(/\D/g, "");
                                }

                                handleParameterChange(idx, item.type, "exception", val);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.number || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.number
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.number}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.number || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.number
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {item.parameterName === "Activity (Text)" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownText
                            title=""
                            itemName={item.parameterName}
                            parentRef={parentRef}
                            isEdited
                            placeholder={`Choose ${item.parameterName}`}
                            currentOption={item.value.options.map((option) => option.value || option)}
                            options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                            onSelect={(items) => {
                              handleParameterChange(idx, item.type, "value", items);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownText
                              title=""
                              itemName={item.parameterName}
                              parentRef={parentRef}
                              isEdited
                              placeholder={`Choose ${item.parameterName}`}
                              currentOption={item.exception.options.map((option) => option.value || option)}
                              options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                              onSelect={(items) => {
                                handleParameterChange(idx, item.type, "exception", items);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {item.parameterName === "Store" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownStore
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
                                    value: store.id,
                                    raw: store,
                                  })) || [],
                                type: "checkbox",
                              },
                            ]}
                            dataFilterResult={dataFilterValue}
                            setDataFilterResult={setSelectedFilterOptionsValue}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.values?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.values?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownStore
                              parentRef={parentRef}
                              options={[
                                {
                                  menu: "Province",
                                  parameter: "province",
                                  submenu:
                                    provincesException?.data?.map((city) => ({
                                      option: city.name,
                                      value: city.code,
                                    })) || [],
                                  type: "checkbox",
                                },
                                {
                                  menu: "City / Regencies",
                                  parameter: "city",
                                  submenu:
                                    citiesException?.data?.map((city) => ({
                                      option: city.name,
                                      value: city.code,
                                    })) || [],
                                  type: "checkbox",
                                },
                                {
                                  menu: "District",
                                  parameter: "district",
                                  submenu:
                                    districtsException?.data?.map((district) => ({
                                      option: district.name,
                                      value: district.code,
                                    })) || [],
                                  type: "checkbox",
                                },
                                {
                                  menu: "Store",
                                  parameter: "store",
                                  submenu:
                                    storesException?.data?.map((store) => ({
                                      option: store.name,
                                      value: store.id,
                                      raw: store,
                                    })) || [],
                                  type: "checkbox",
                                },
                              ]}
                              dataFilterResult={dataFilterException}
                              setDataFilterResult={setSelectedFilterOptionsException}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {item.parameterName === "Payment Method" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownText
                            title=""
                            itemName={item.parameterName}
                            parentRef={parentRef}
                            isEdited
                            placeholder={`Choose ${item.parameterName}`}
                            currentOption={item.value.options.map((option) => option.value || option)}
                            options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                            onSelect={(items) => {
                              handleParameterChange(idx, item.type, "value", items);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownText
                              title=""
                              itemName={item.parameterName}
                              parentRef={parentRef}
                              isEdited
                              placeholder={`Choose ${item.parameterName}`}
                              currentOption={item.exception.options.map((option) => option.value || option)}
                              options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                              onSelect={(items) => {
                                handleParameterChange(idx, item.type, "exception", items);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {item.parameterName === "Date Time" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <CustomDateTimePicker
                            parentRef={parentRef}
                            value={[
                              item.value.startDate,
                              item.value.endDate,
                              item.value.isEndDate,
                              item.value.isIncludeTime,
                            ]}
                            onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                              handleTimeFrameChange(idx, "value", {
                                startDate,
                                endDate,
                                isEndDate,
                                isIncludeTime,
                              });
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.startDate || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.startDate
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.[item.type]}`
                                : null
                            }
                            mode="disable"
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <CustomDateTimePicker
                              parentRef={parentRef}
                              value={[
                                item.exception.startDate,
                                item.exception.endDate,
                                item.exception.isEndDate,
                                item.exception.isIncludeTime,
                              ]}
                              onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                                handleTimeFrameChange(idx, "exception", {
                                  startDate,
                                  endDate,
                                  isEndDate,
                                  isIncludeTime,
                                });
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.startDate ||
                                  formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception
                                  ? `${item.parameterName} ${
                                      formik.errors.pointParameters?.[idx]?.exception?.[item.type]
                                    }`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.startDate ||
                                  formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {item.type === "option" && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <DropDownText
                            title=""
                            itemName={item.parameterName}
                            parentRef={parentRef}
                            isEdited
                            placeholder={`Choose ${item.parameterName}`}
                            currentOption={item.value.options.map((option) => option.value || option)}
                            options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                            onSelect={(items) => {
                              handleParameterChange(idx, item.type, "value", items);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.options}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.options || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.options
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <DropDownText
                              title=""
                              itemName={item.parameterName}
                              parentRef={parentRef}
                              isEdited
                              placeholder={`Choose ${item.parameterName}`}
                              currentOption={item.exception.options.map((option) => option.value || option)}
                              options={item.option.map((opt) => ({ option: opt.value, value: opt.id }))}
                              onSelect={(items) => {
                                handleParameterChange(idx, item.type, "exception", items);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.exception?.options}`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.options || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.options
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}

                      {(item.type === "text" || item.type === "number") && (
                        <div className="flex flex-col gap-4 p-2 border-t border-neutral40">
                          <TextInput
                            placeholder={`Input ${item.parameterName}`}
                            value={item.type === "number" ? formatNumber(item.value.number) : item.value.text}
                            onChangeInput={(e) => {
                              let val = e.target.value;

                              if (item.type === "number") {
                                // remove non-digits before storing in state
                                val = val.replace(/\D/g, "");
                              }

                              handleParameterChange(idx, item.type, "value", val);
                            }}
                            footer={
                              (formik.touched.pointParameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.number
                                ? `${item.parameterName} ${formik.errors.pointParameters?.[idx]?.value?.[item.type]}`
                                : null
                            }
                            mode={
                              (formik.touched.pointParameters?.[idx]?.value?.number || formik.submitCount > 0) &&
                              formik.errors.pointParameters?.[idx]?.value?.number
                                ? "danger"
                                : "default"
                            }
                          />

                          <div className="border border-dashed border-neutral80" />

                          <div className="bg-primary50 rounded-md flex flex-col p-2 gap-1">
                            <p>Exception</p>
                            <TextInput
                              placeholder={`Input ${item.parameterName}`}
                              value={
                                item.type === "number" ? formatNumber(item.exception?.number) : item.exception?.text
                              }
                              onChangeInput={(e) => {
                                let val = e.target.value;

                                if (item.type === "number") {
                                  // remove non-digits before storing in state
                                  val = val.replace(/\D/g, "");
                                }

                                handleParameterChange(idx, item.type, "exception", val);
                              }}
                              footer={
                                (formik.touched.pointParameters?.[idx]?.exception?.number || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.number
                                  ? `${item.parameterName} ${
                                      formik.errors.pointParameters?.[idx]?.exception?.[item.type]
                                    }`
                                  : null
                              }
                              mode={
                                (formik.touched.pointParameters?.[idx]?.exception?.number || formik.submitCount > 0) &&
                                formik.errors.pointParameters?.[idx]?.exception?.number
                                  ? "danger"
                                  : "default"
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
      <ModalParameter isOpen={parameterFormIsOpen} onClose={toggleParameterForm} onSubmit={addNewParameter} />
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />
      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
    </div>
  );
};

export default ParameterSection;
