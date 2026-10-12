import React from "react";
import { Fragment, useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import PrimaryButton from "../../button/primarybutton";
import OutlineButton from "../../button/outlinebutton";
import { DropdownText, TextInput } from "sprint-asia-custom-component";
import { X, Trash } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { DeleteOption } from "../../../service/settingparametermanagement/endpoint";

const ModalParameter = ({
  isOpen = false,
  onClose = () => { },
  title = "Title Modal",
  selectedParameter,
  setSelectedParameter,
  onSubmit = () => { },
  reRender,
}) => {
  const cancelButtonRef = useRef(null);
  const [currentId, setCurrentId] = useState(null);
  const [currentOption, setCurrentOption] = useState(null);
  const [isModalOpenLoading, setIsModalOpenLoading] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const { isOpen: confirmationDeleteModalIsOpen, toggle: toggleConfirmationDeleteModal } = useDisclosure(false);

  const handleToggleConfirmationModal = () => {
    onClose();
    toggleConfirmationModal();
  };

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1000);
    }, 250);
  }

  const validationSchema = yup.object().shape({
    parameterName: yup
      .string()
      .required("Parameter name is required")
      .min(3, "Parameter name must be between 3 and 50 characters long")
      .max(50, "Parameter name must be between 3 and 50 characters long"),
    type: yup.string().required("Type is required"),
    option: yup.array().when("type", {
      is: "option",
      then: (schema) =>
        schema
          .of(
            yup.object().shape({
              id: yup.string().nullable(),
              value: yup
                .string()
                .max(20, "Status must be less than 20 characters long")
                .required("Status is required"),
            })
          )
          .min(1, "At least one option is required")
          .required("Option is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const validate = async (values) => {
    const errors = {};

    // Jalankan Yup validation untuk field lain (parameterName, type, dll)
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

    // ✅ Custom validation untuk option
    if (formik.values.type === "option") {
      const optionErrors = Array(values.option.length).fill(undefined);
      const seen = {};

      values.option.forEach((opt, index) => {
        const val = opt?.value ?? ""; // ambil value dari objek
        const trimmed = val.trim();

        // 1️⃣ Cek kosong
        if (!trimmed) {
          optionErrors[index] = "Option is required";
          return;
        }

        // 2️⃣ Cek panjang maksimal
        if (trimmed.length > 20) {
          optionErrors[index] = "Option must be less than 20 characters";
          return;
        }

        // 3️⃣ Cek duplikat
        if (seen[trimmed.toLowerCase()]) {
          if (!optionErrors[index]) {
            optionErrors[index] = "Option can't be duplicate";
          }

          const firstIndex = values.option.findIndex((v) => v?.value?.trim().toLowerCase() === trimmed.toLowerCase());
          if (firstIndex !== -1 && !optionErrors[firstIndex]) {
            optionErrors[firstIndex] = "Option can't be duplicate";
          }
        } else {
          seen[trimmed.toLowerCase()] = true;
        }
      });

      if (optionErrors.some(Boolean)) {
        errors.option = optionErrors;
      }
    }

    return errors;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parameterName: selectedParameter?.parameterName || "",
      type: selectedParameter?.type || "",
      option: selectedParameter?.option?.map((opt) => ({
        id: opt.id || "",
        value: opt.value || "",
      })) || [{ id: "", value: "" }],
    },
    validate,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  // 🔹 ubah value di dalam object option[index]
  const handleChangeOption = (e, index) => {
    const inputValue = e.target.value;
    const updatedOptions = [...formik.values.option];
    updatedOptions[index] = {
      ...updatedOptions[index],
      value: inputValue,
    };

    formik.setFieldTouched(`option[${index}]`, true, false);
    formik.setFieldValue("option", updatedOptions);
  };

  // 🔹 tambah option baru (id random biar unik)
  const addMoreStatus = () => {
    const newOption = { id: "", value: "" };
    formik.setFieldValue("option", [...formik.values.option, newOption]);
  };

  async function handleDeleteParameter(index, currentOption) {
    try {
      setIsModalOpenLoading(true);
      if (currentOption.id) {
        await DeleteOption(currentOption.id);
      }
      setIsModalOpenLoading(false);
      if (!Array.isArray(formik.values.option)) return;
      const newOptions = formik.values.option.filter((_, i) => i !== index);
      formik.setFieldValue("option", newOptions);
      handleOpenModalResult("success", `Option in ${formik.values.parameterName} has been successfully deleted.`);
      reRender();
    } catch (error) {
      setIsModalOpenLoading(false);
      if (error?.response?.data?.rc === 409) {
        handleOpenModalResult(
          "failed",
          "This option cannot be deleted because it is currently linked to an active campaign."
        );
      } else {
        handleOpenModalResult("failed", `Failed to delete ${formik.values.parameterName}. Please try again.`);
      }
    } finally {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }

  useEffect(() => {
    if (formik.values.type === "option" && !formik.values.option.length) {
      formik.setFieldValue("option", [""]);
    }
  }, [formik.values.type, formik.values.option]);

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => {
            if (formik.dirty) {
              handleToggleConfirmationModal();
            } else {
              onClose();
              setSelectedParameter(null);
              formik.resetForm();
            }
          }}
          static={false}
          style={{ zIndex: 1001 }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => { }} />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex justify-between py-3 px-3">
                  <p className="font-semibold text-xl text-black">{title}</p>
                  <p
                    className="cursor-pointer text-xl"
                    onClick={() => {
                      if (formik.dirty) {
                        handleToggleConfirmationModal();
                      } else {
                        onClose();
                        setSelectedParameter(null);
                        formik.resetForm();
                      }
                    }}
                  >
                    <X size={24} />
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
                          formik.values.parameterName === "Program"
                            ? "disable"
                            : (formik.touched.parameterName || formik.submitCount > 0) && formik.errors.parameterName
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
                          (formik.touched.type || formik.submitCount > 0) && formik.errors.type
                            ? formik.errors.type
                            : null
                        }
                        mode={
                          (formik.touched.type || formik.submitCount > 0) && formik.errors.type ? "danger" : "default"
                        }
                        isEdited={formik.values.parameterName === "Program" ? false : true}
                        currentOption={formik.values.type}
                      />
                    </div>

                    {formik.values.type === "option" && (
                      <div className="mt-3">
                        {formik.values.option && (
                          <div className="max-h-80 overflow-y-auto">
                            {formik.values.option.map((option, index) => (
                              <div key={option.id || index} className="mb-3">
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
                                  rightAdornment={
                                    <Trash
                                      className="text-danger500 cursor-pointer"
                                      onClick={() => {
                                        setCurrentOption(option);
                                        setCurrentId(index);
                                        onClose();
                                        toggleConfirmationDeleteModal();
                                      }}
                                    />
                                  }
                                  value={option.value || ""}
                                />
                                <div className="flex justify-end">
                                  <p className="text-gray-500 text-sm mt-1">{option.value?.length || 0}/20</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {formik.values.option.length < 20 && (
                          <div className="flex justify-end">
                            <button type="button" className="text-primary500 text-sm mt-2" onClick={addMoreStatus}>
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
                        title={selectedParameter ? "Update" : "Submit"}
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
                          setSelectedParameter(null);
                          formik.resetForm();
                        }
                      }}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <ConfirmationModal
        isOpen={confirmationModalIsOpen}
        onClick={() => {
          toggleConfirmationModal();
          formik.resetForm();
          setSelectedParameter(null);
        }}
        onClose={handleToggleConfirmationModal}
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        title="Do you want to cancel?"
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isModalOpenLoading} onClose={() => { }} />

      <ConfirmationModal
        isOpen={confirmationDeleteModalIsOpen}
        onClick={() => {
          toggleConfirmationDeleteModal();
          handleDeleteParameter(currentId, currentOption);
        }}
        onClose={() => {
          toggleConfirmationDeleteModal();
          onClose();
        }}
        subtitle={
          <p>
            Are you sure you want to delete the option in{" "}
            <span className="font-semibold">{formik.values.parameterName}</span>? This action cannot be undone.
          </p>
        }
        title="Delete Option"
        titleButton="Yes"
      />
    </>
  );
};

export default ModalParameter;
