import React from "react";
import { Fragment, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import { DropdownText, TextInput, PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import { XIcon } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import ConfirmationModal from "../../../../ConfirmationModal/ConfirmationModal";
import Modal from "prezent/Modal";

const ModalParameter = ({ isOpen, onClose = () => {}, title = "Title Modal", onSubmit = () => {} }) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);

  const handleToggleConfirmationModal = () => {
    onClose();
    toggleConfirmationModal();
  };

  const validationSchema = yup.object().shape({
    parameterName: yup
      .string()
      .min(3, "Parameter name must be between 3 and 50 characters long")
      .max(50, "Parameter name must be between 3 and 50 characters long")
      .required("Parameter name is required"),
    type: yup.string().required("Type is required"),
    option: yup
      .array()
      .of(yup.string().max(20, "Status must be less than 20 characters long").required("Status is required")),
  });

  const validate = async (values) => {
    const errors = {};

    // Run Yup validation for other fields (parameterName, type, etc.)
    try {
      await validationSchema.validate(values, { abortEarly: false });
    } catch (yupError) {
      if (yupError.inner) {
        yupError.inner.forEach((err) => {
          if (!errors[err.path]) {
            errors[err.path] = err.message;
          }
        });
      }
    }

    // Custom validation for option
    if (values.option) {
      const statusErrors = Array(values.option.length).fill(undefined);
      const seen = {};

      values.option.forEach((val, index) => {
        // Trim the value for consistent checks
        const trimmed = val?.trim() || "";

        // 1. Empty check
        if (!trimmed) {
          statusErrors[index] = "Status is required";
          return;
        }

        // 2. Max length check
        if (trimmed.length > 20) {
          statusErrors[index] = "Status must be less than 20 characters";
          return;
        }

        // 3. Duplicate check
        if (seen[trimmed]) {
          if (!statusErrors[index]) {
            statusErrors[index] = "Option can't be duplicate";
          }

          const firstIndex = values.option.findIndex((v) => v?.trim() === trimmed);
          if (!statusErrors[firstIndex]) {
            statusErrors[firstIndex] = "Option can't be duplicate";
          }
        } else {
          seen[trimmed] = true;
        }
      });

      if (statusErrors.some(Boolean)) {
        errors.option = statusErrors;
      }
    }

    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parameterName: "",
      type: "",
      option: [],
    },
    validate,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  const handleChangeOption = (e, index) => {
    const inputValue = e.target.value;
    const statusArray = [...formik.values.option];
    statusArray[index] = inputValue;

    formik.setFieldTouched(`option[${index}]`, true, false);
    formik.setFieldValue("option", statusArray);
  };

  const addMoreStatus = () => {
    formik.setFieldValue("option", [...formik.values.option, ""]);
  };

  useEffect(() => {
    if (formik.values.type === "option" && !formik.values.option.length) {
      formik.setFieldValue("option", [""]);
    }
  }, [formik.values.type, formik.values.option]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          if (formik.dirty) {
            handleToggleConfirmationModal();
          } else {
            onClose();

            formik.resetForm();
          }
        }}
      >
        <div className="flex flex-col w-96">
          <div className="flex justify-between py-3 px-3">
            <p className="font-semibold text-xl text-black">{title}</p>
            <p
              className="cursor-pointer text-xl"
              onClick={() => {
                if (formik.dirty) {
                  handleToggleConfirmationModal();
                } else {
                  onClose();

                  formik.resetForm();
                }
              }}
            >
              <XIcon size={24} />
            </p>
          </div>

          <div className="border-t border-b border-neutral30 py-2 px-2">
            <div className="py-2 px-2">
              <div>
                <TextInput
                  title="Parameter Name"
                  placeholder="Input Name"
                  onChangeInput={(e) => {
                    formik.setFieldValue("parameterName", e.target.value);
                    formik.setFieldTouched("parameterName", true, false);
                  }}
                  footer={
                    (formik.touched.parameterName || formik.submitCount > 0) && formik.errors.parameterName
                      ? formik.errors.parameterName
                      : null
                  }
                  mode={
                    (formik.touched.parameterName || formik.submitCount > 0) && formik.errors.parameterName
                      ? "danger"
                      : "default"
                  }
                  isRequired
                  value={formik.values.parameterName}
                />
              </div>
              <div className="pt-3">
                <DropdownText
                  title="Type"
                  placeholder="Choose Type"
                  options={[
                    { option: "Text", value: "text" },
                    { option: "Number", value: "number" },
                    { option: "Option", value: "option" },
                  ]}
                  isRequired={false}
                  onSelect={(e) => {
                    formik.setFieldValue("type", e.value);
                    formik.setFieldTouched("type", true, false);
                  }}
                  footer={
                    (formik.touched.type || formik.submitCount > 0) && formik.errors.type ? formik.errors.type : null
                  }
                  mode={(formik.touched.type || formik.submitCount > 0) && formik.errors.type ? "danger" : "default"}
                  currentOption={formik.values.type}
                />
              </div>

              {formik.values.type === "option" && (
                <div className="mt-3">
                  {formik.values.option && (
                    <div className="max-h-80 overflow-y-auto">
                      {formik.values.option.map((option, index) => (
                        <div key={index} className="mb-3">
                          <TextInput
                            title={`Option ${index + 1}`}
                            placeholder="Input Option"
                            isRequired={false}
                            onChangeInput={(e) => handleChangeOption(e, index)}
                            footer={
                              (formik.touched.option || formik.submitCount > 0) && formik.errors.option
                                ? formik.errors.option[index]
                                : null
                            }
                            mode={
                              (formik.touched.option || formik.submitCount > 0) && formik.errors.option?.[index]
                                ? "danger"
                                : "default"
                            }
                            value={option || ""}
                          />
                          <div className="flex justify-end">
                            <p className="text-gray-500 text-sm mt-1">{option?.length || 0}/20</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formik.values.option.length < 20 && (
                    <div className="flex justify-end">
                      <button className="text-primary500 text-sm mt-2" onClick={addMoreStatus}>
                        + Add more
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
            <div className="my-3">
              <div className="ml-2">
                <PrimaryButton
                  title="Submit"
                  type="wrap"
                  size="large"
                  onClick={formik.handleSubmit}
                  isActive={
                    Array.isArray(formik.errors.option)
                      ? formik.errors.option.every((err) => !err)
                      : !formik.errors.option
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <OutlineButton
                title="Cancel"
                type="full"
                size="large"
                onClick={() => {
                  if (formik.dirty) {
                    handleToggleConfirmationModal();
                  } else {
                    onClose();

                    formik.resetForm();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        onClick={() => {
          toggleConfirmationModal();
          formik.resetForm();
        }}
        onClose={handleToggleConfirmationModal}
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        title="Do you want to cancel?"
      />
    </>
  );
};

export default ModalParameter;
