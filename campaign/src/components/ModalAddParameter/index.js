import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, TextInput, OutlineButton, DropdownText } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";

const ModalAddParameter = ({ isOpen = false, onClose = () => {}, title = "Loading...", leftAction, rightAction }) => {
  const cancelButtonRef = useRef(null);

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  const localFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parameterName: "",
      type: "",
      status: [{ value: "" }],
    },
    validationSchema: yup.object().shape({
      parameterName: yup
        .string()
        .min(1, "Parameter name must be between 5 and 20 characters long")
        .max(20, "Parameter name must be between 5 and 20 characters long")
        .required("Parameter name is required"),
      type: yup.string().required("Type is required"),
      status: yup.mixed().when("type", {
        is: (value) => value === "Status",
        then: () => yup.mixed().required("Status is required"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      rightAction(values);
      resetForm();
    },
  });

  const addMoreStatus = () => {
    localFormik.setFieldValue("status", [...localFormik.values.status, { value: "" }]);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={() => isOpen}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleBackgroundClick} />
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
            <Dialog.Panel className="relative w-full max-w-xl bg-white rounded-lg shadow-xl transition-all">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-3">
                <div className="py-3 px-6">
                  <div>
                    <TextInput
                      title="Parameter Name"
                      placeholder="Input Parameter Name"
                      onChangeInput={(e) => localFormik.setFieldValue("parameterName", e.target.value)}
                      footer={localFormik.errors.parameterName}
                      isRequired
                      mode={localFormik.errors.parameterName ? "danger" : "default"}
                      value={localFormik.values.parameterName}
                    />
                  </div>
                  <div className="pt-3">
                    <DropdownText
                      title="Type"
                      placeholder="Select Type"
                      options={[
                        { option: "Text", value: "Text" },
                        { option: "Number", value: "Number" },
                        { option: "Status", value: "Status" },
                      ]}
                      isRequired
                      onSelect={(e) => {
                        localFormik.setFieldValue("type", e.value);
                      }}
                      currentOption={localFormik.values.type}
                      footer={localFormik.errors.type}
                      mode={localFormik.errors.type ? "danger" : "default"}
                    />
                  </div>

                  {localFormik.values.type === "Status" && (
                    <div className="mt-3">
                      {localFormik.values.status &&
                        localFormik.values.status.map((status, index) => (
                          <div key={index} className="mb-3">
                            <TextInput
                              key={index}
                              title={`Status ${index + 1}`}
                              placeholder={`Input Status ${index + 1}`}
                              isRequired={false}
                              onChangeInput={(e) => localFormik.setFieldValue(`status[${index}].value`, e.target.value)}
                              value={status.value || ""}
                            />
                            <div className="flex justify-end">
                              <p className="text-gray-500 text-sm mt-1">{status.value.length}/20</p>
                            </div>
                          </div>
                        ))}

                      <div className="flex justify-end">
                        <button className="text-primary500 text-sm mt-2" onClick={addMoreStatus}>
                          + Add more
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-neutral30 py-3 flex justify-end px-6">
                <div className="mr-3">
                  <OutlineButton title="Cancel" onClick={() => leftAction()} />
                </div>
                <PrimaryButton title="Submit" onClick={localFormik.handleSubmit} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalAddParameter;
