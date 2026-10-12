import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { CaretDown, DotsSixVertical, Plus, Trash } from "@phosphor-icons/react";
import { DropdownText, TextInput, Switch } from "sprint-asia-custom-component";

const ContentItem = ({
  type,
  category,
  label,
  instruction,
  disabled,
  actions,
  isRequired,
  contents,
  setContents,
  sequence,
  options = [],
  voucherId,
  triggerValidation = () => {},
  setRedeemInformationIsError,
}) => {
  const contentRef = useRef(null); // Create a ref for the content
  const [maxHeight, setMaxHeight] = useState("0px");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const types = [
    { option: "Text", value: "text" },
    { option: "Phone number", value: "phone number" },
    { option: "Email", value: "email" },
    { option: "Number", value: "number" },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChangeField = (field, input) => {
    const updatedContents = contents.map((item) => {
      if (item.sequence === sequence) {
        if (field === "category") {
          return { ...item, category: input }; // Create a new object with updated field
        } else if (field === "label") {
          return { ...item, label: input };
        } else if (field === "instruction") {
          return { ...item, instruction: input };
        } else if (field === "required") {
          return { ...item, isRequired: input };
        }
      }
      return item; // Return unchanged item
    });
    setContents(updatedContents); // Update state with the new array
  };

  const removeContent = () => {
    const updatedContents = contents.filter((item) => item.sequence !== sequence);
    setContents(updatedContents);
  };

  const handleAddOption = () => {
    setContents((prevContents) =>
      prevContents.map((content) => {
        // Check if the content's sequence matches the one we want to modify
        if (content.sequence === sequence) {
          // Create a new object with updated options
          return {
            ...content,
            options: [...content.options, ""], // Add a new empty option to the options array
          };
        }
        return content; // If no match, return the original content
      })
    );
  };

  const handleOptionChange = (value, idx) => {
    setContents((prevContents) =>
      prevContents.map((content) => {
        if (content.sequence === sequence) {
          // Update the option at the correct index
          const updatedOptions = content.options.map((option, optionIdx) => (optionIdx === idx ? value : option));

          // Return a new content object with the updated options
          return {
            ...content,
            options: updatedOptions,
          };
        }
        return content; // No change for other contents
      })
    );
  };

  const handleDeleteOption = (idx) => {
    setContents((prevContents) =>
      prevContents.map((content) => {
        if (content.sequence === sequence) {
          // Filter out the option at the specified index
          const updatedOptions = content.options.filter((_, optionIdx) => optionIdx !== idx);

          // Return a new content object with the updated options
          return {
            ...content,
            options: updatedOptions,
          };
        }
        return content; // No change for other contents
      })
    );
  };

  const formik = useFormik({
    initialValues: {
      options: options.length ? options : [""], // Default to one empty option if none exist
      label: label || "",
      instruction: instruction || "",
    },
    validationSchema: yup.object().shape({
      options:
        options.length &&
        yup
          .array()
          .of(
            yup
              .string()
              .required("Option is required")
              .min(5, "Must have at least 5 characters")
              .max(20, "Too long. Max 20 characters")
          ),
      label:
        type === "Address"
          ? yup.array().required("Label is required")
          : type !== "Store Code" &&
            yup
              .string()
              .min(5, "Must have at least 5 characters")
              .max(20, "Too long. Max 20 characters")
              .required("Label is required"),
      instruction:
        type !== "Single Choice" &&
        type !== "Multiple Choice" &&
        type !== "Store Code" &&
        type !== "Address" &&
        yup
          .string()
          .min(5, "Must have at least 5 characters")
          .max(20, "Too long. Max 20 characters")
          .required("Instruction is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    triggerValidation(() => formik.validateForm());
  }, []);

  useEffect(() => {
    // Check if there are any errors in Formik
    const hasErrors = Object.keys(formik.errors).length > 0;
    setRedeemInformationIsError(hasErrors);
  }, [formik.errors]);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isCollapsed ? "0px" : `${contentRef.current.scrollHeight}px`);
    }
  }, [isCollapsed, options]); // Add options as dependency

  return (
    <div className={`rounded-md bg-primary50 w-full flex flex-col gap-2 px-3 py-4`}>
      <div className="flex flex-row justify-between items-center mt-1">
        <div className="flex flex-row gap-2 items-center">
          <DotsSixVertical size={18} />
          <p className="text-sm font-medium">{type === "Address" ? `${type}` : `${type}` + " · " + `${label}`}</p>
        </div>

        <a className="cursor-pointer" onClick={toggleCollapse}>
          <CaretDown
            size={18}
            style={{
              transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.3s",
            }}
          />
        </a>
      </div>

      <div
        className={`bg-white rounded-md w-full overflow-hidden transition-[max-height] duration-300`}
        style={{ maxHeight }} // Set dynamic max-height
        ref={contentRef} // Ref for measuring the content's height
      >
        <div className="p-4 flex flex-col gap-4">
          {type !== "Address" ? (
            <>
              {(type === "Short Answer" || type === "Paragraph" || type === "Store Code") && (
                <DropdownText
                  title=""
                  isRequired={false}
                  placeholder="Choose redeem category"
                  options={types}
                  onSelect={(e) => handleChangeField("category", e.value)}
                  currentOption={category === "meter number" ? "number" : category}
                  isEdited={!disabled && !voucherId}
                />
              )}

              <TextInput
                title="Label"
                placeholder="Input label"
                value={label}
                mode={disabled || voucherId ? "disable" : formik.errors.label ? "danger" : "default"}
                footer={formik.errors.label}
                onChangeInput={(e) => {
                  const value = e.target.value;
                  handleChangeField("label", value);
                  formik.setFieldValue("label", value);
                  formik.validateField("label");
                }}
              />

              {type !== "Single Choice" && type !== "Multiple Choice" && (
                <TextInput
                  title="Instruction"
                  isRequired={false}
                  placeholder="Input instruction"
                  value={instruction}
                  mode={disabled || voucherId ? "disable" : formik.errors.instruction ? "danger" : "default"}
                  footer={formik.errors.instruction}
                  onChangeInput={(e) => {
                    const value = e.target.value;
                    handleChangeField("instruction", value);
                    formik.setFieldValue("instruction", value);
                    formik.validateField("instruction");
                  }}
                />
              )}
            </>
          ) : (
            label?.map((item, idx) => (
              <TextInput
                key={idx}
                title="Label"
                placeholder="Input label"
                value={item}
                mode="disable"
                isRequired={false}
              />
            ))
          )}

          {options.length
            ? options.map((option, idx) => (
                <div className="flex items-center gap-4">
                  <TextInput
                    key={idx}
                    title="Options"
                    isRequired={false}
                    placeholder="Input option"
                    value={option}
                    onChangeInput={(e) => {
                      const value = e.target.value;
                      handleOptionChange(value, idx);
                      formik.setFieldValue(`options[${idx}]`, value);
                    }}
                    mode={
                      voucherId ? "disable" : formik.errors.options && formik.errors.options[idx] ? "danger" : "default"
                    }
                    footer={formik.errors.options && formik.errors.options[idx] ? formik.errors.options[idx] : null}
                  />

                  {!voucherId && (
                    <a className="cursor-pointer mt-4" onClick={() => handleDeleteOption(idx)}>
                      <Trash size={20} />
                    </a>
                  )}
                </div>
              ))
            : null}

          {(type === "Single Choice" || type === "Multiple Choice") && options.length < 10 && !voucherId && (
            <button
              className="border-2 border-primary500 text-md rounded-lg cursor-pointer flex flex-row items-center justify-center gap-2 self-start px-3 py-1"
              onClick={handleAddOption}
            >
              <Plus className="text-primary500" />

              <p className="text-primary500">Add Option</p>
            </button>
          )}

          {actions && !voucherId && (
            <div className="flex flex-row justify-end items-center gap-2">
              <p className="font-bold text-sm">Required</p>

              <Switch
                onChange={() => handleChangeField("required", isRequired ? false : true)}
                checked={isRequired}
                isEdit={!disabled}
              />

              <a className="text-danger500 cursor-pointer" onClick={removeContent}>
                <Trash size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentItem;
