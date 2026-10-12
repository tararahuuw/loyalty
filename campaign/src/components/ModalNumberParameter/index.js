import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, TextInput, OutlineButton } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";

const ModalNumberParameter = ({ isOpen = false, onClose = () => {}, title = "Loading...", currentData, formik }) => {
  const cancelButtonRef = useRef(null);

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  const localFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      min: currentData.minimum,
      max: currentData.maximum,
    },
    validationSchema: yup.object().shape({
      min: yup.number().required("Minimum is required").moreThan(0, "Minimum must be greater than 0"),
      max: yup
        .number()
        .nullable()
        .notRequired()
        .moreThan(0, "Maximum must be greater than 0")
        .when("min", (min, schema) =>
          schema.test({
            name: "is-greater",
            message: "Maximum must be greater than minimum",
            test: function (max) {
              if (max) {
                return max >= min;
              }
              return true;
            },
          })
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (!currentData.isException) {
        if (values.min) {
          formik.setFieldValue(`param[${currentData.index}].errorValue`, "");
        } else {
          formik.setFieldValue(`param[${currentData.index}].errorValue`, `${title} is required`);
        }
      }
      formik.setFieldValue(
        `param[${currentData.index}].${currentData.isException ? "exception" : "value"}.min`,
        values.min ? Number(values.min) : null
      );
      formik.setFieldValue(
        `param[${currentData.index}].${currentData.isException ? "exception" : "value"}.max`,
        values.max ? Number(values.max) : null
      );
      onClose();
    },
  });

  useEffect(() => {
    localFormik.setValues({
      min: currentData.minimum,
      max: currentData.maximum,
    });
  }, [currentData, isOpen]);

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
                <div className="px-6">
                  <div className="mb-2">
                    <TextInput
                      title="Minimum value"
                      placeholder="Input minimum value"
                      value={localFormik.values.min}
                      onChangeInput={(e) => {
                        localFormik.setFieldValue("min", e.target.value);
                        localFormik.setFieldTouched("min", true, false);
                      }}
                      footer={
                        (localFormik.touched.min || localFormik.submitCount > 0) && localFormik.errors.min
                          ? localFormik.errors.min
                          : null
                      }
                      mode={
                        (localFormik.touched.min || localFormik.submitCount > 0) && localFormik.errors.min
                          ? "danger"
                          : "default"
                      }
                      isRequired
                      type="number"
                      minimum={1}
                    />
                  </div>
                  <div className="mb-2">
                    <TextInput
                      title="Maximum value"
                      placeholder="Input maximum value"
                      value={localFormik.values.max}
                      isRequired={false}
                      type="number"
                      minimum={Number(localFormik.values.min)}
                      onChangeInput={(e) => {
                        localFormik.setFieldValue("max", e.target.value);
                        localFormik.setFieldTouched("max", true, false);
                      }}
                      footer={
                        (localFormik.touched.max || localFormik.submitCount > 0) && localFormik.errors.max
                          ? localFormik.errors.max
                          : null
                      }
                      mode={
                        (localFormik.touched.max || localFormik.submitCount > 0) && localFormik.errors.max
                          ? "danger"
                          : "default"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-neutral30 py-3 flex justify-end px-6">
                <div className="mr-3">
                  <OutlineButton title="Cancel" onClick={onClose} />
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

export default ModalNumberParameter;
