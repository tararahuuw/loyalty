import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { useFetch } from "prezent/useFetch";
import TextInput from "prezent/TextInput";
import { GetTreeByID } from "../../service/inventoryManagement/endpoint/category";
import DropDownSearch from "./DropDownSearch";
import { useFormik } from "formik";
import * as yup from "yup";

const EditCategoryModal = ({ isOpen, onClose, onSubmit, selectedCategory }) => {
  const cancelButtonRef = useRef(null);
  const { data } = useFetch(selectedCategory?.id && GetTreeByID, "selected-category", [], selectedCategory?.id);

  const getLastChildName = () => {
    if (!selectedCategory || typeof selectedCategory !== "object") return "";

    let lastValue = "";

    for (let i = 1; i <= 5; i++) {
      const key = `level${i}`;
      const value = selectedCategory[key];

      if (value && typeof value === "string" && value.trim() !== "") {
        lastValue = value;
      } else {
        break; // stop at first missing or empty level
      }
    }

    return lastValue;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: getLastChildName() || "",
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Category name is required")
        .min(1, "Minimum 1 and maximum 150 characters allowed.")
        .max(150, "Minimum 1 and maximum 150 characters allowed.")
        .matches(/^[a-zA-Z0-9\s]+$/, "Special characters are not allowed"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={(e) => e.stopPropagation()} />
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">Edit Category</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <XIcon size={24} />
                </p>
              </div>

              <div className="bg-white h-full px-8 py-4 border-t border-b border-neutral40">
                <div className="flex h-full">
                  {/* CATEGORY 1 */}
                  <div className="h-full flex-1">
                    <div className="border border-neutral40 text-neutral500 text-xs font-semibold rounded-tl-md bg-neutral20 flex p-4">
                      <p>CATEGORY LEVEL 1</p>
                      <p className="text-danger500">*</p>
                    </div>

                    <div className="border border-t-0 border-neutral40 p-4 overflow-y-auto" style={{ height: "200px" }}>
                      {selectedCategory?.level1 && (
                        <>
                          {data?.data?.id === selectedCategory?.id ? (
                            <TextInput
                              value={formik.values.name}
                              placeholder="Input category name"
                              onChangeInput={(e) => {
                                const newName = e.target.value;
                                formik.setFieldValue("name", newName);
                                formik.setFieldTouched("name", true, false);
                              }}
                              footer={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? formik.errors.name
                                  : null
                              }
                              mode={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? "danger"
                                  : "default"
                              }
                            />
                          ) : (
                            <DropDownSearch placeholder={data?.data?.name} disabled />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY 2 */}
                  <div className="h-full flex-1">
                    <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
                      <p>CATEGORY LEVEL 2</p>
                      <p className="text-danger500">*</p>
                    </div>

                    <div
                      className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
                      style={{ height: "200px" }}
                    >
                      {selectedCategory?.level2 && (
                        <>
                          {data?.data?.children[0]?.id === selectedCategory?.id ? (
                            <TextInput
                              value={formik.values.name}
                              placeholder="Input category name"
                              onChangeInput={(e) => {
                                const newName = e.target.value;
                                formik.setFieldValue("name", newName);
                                formik.setFieldTouched("name", true, false);
                              }}
                              footer={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? formik.errors.name
                                  : null
                              }
                              mode={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? "danger"
                                  : "default"
                              }
                            />
                          ) : (
                            <DropDownSearch placeholder={data?.data?.children[0]?.name} disabled />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY 3 */}
                  <div className="h-full flex-1">
                    <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
                      <p>CATEGORY LEVEL 3</p>
                    </div>

                    <div
                      className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
                      style={{ height: "200px" }}
                    >
                      {selectedCategory?.level3 && (
                        <>
                          {data?.data?.children[0]?.children[0]?.id === selectedCategory?.id ? (
                            <TextInput
                              value={formik.values.name}
                              placeholder="Input category name"
                              onChangeInput={(e) => {
                                const newName = e.target.value;
                                formik.setFieldValue("name", newName);
                                formik.setFieldTouched("name", true, false);
                              }}
                              footer={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? formik.errors.name
                                  : null
                              }
                              mode={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? "danger"
                                  : "default"
                              }
                            />
                          ) : (
                            <DropDownSearch placeholder={data?.data?.children[0]?.children[0]?.name} disabled />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY 4 */}
                  <div className="h-full flex-1">
                    <div className="border border-l-0 border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
                      <p>CATEGORY LEVEL 4</p>
                    </div>

                    <div
                      className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
                      style={{ height: "200px" }}
                    >
                      {selectedCategory?.level4 && (
                        <>
                          {data?.data?.children[0]?.children[0]?.children[0]?.id === selectedCategory?.id ? (
                            <TextInput
                              value={formik.values.name}
                              placeholder="Input category name"
                              onChangeInput={(e) => {
                                const newName = e.target.value;
                                formik.setFieldValue("name", newName);
                                formik.setFieldTouched("name", true, false);
                              }}
                              footer={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? formik.errors.name
                                  : null
                              }
                              mode={
                                (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                                  ? "danger"
                                  : "default"
                              }
                            />
                          ) : (
                            <DropDownSearch
                              placeholder={data?.data?.children[0]?.children[0]?.children[0]?.name}
                              disabled
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY 5 */}
                  <div className="h-full flex-1">
                    <div className="border border-l-0 rounded-tr-md border-neutral40 text-neutral500 text-xs font-semibold bg-neutral20 flex p-4">
                      <p>CATEGORY LEVEL 5</p>
                    </div>

                    <div
                      className="border border-t-0 border-l-0 border-neutral40 overflow-y-auto p-4 flex flex-col gap-2"
                      style={{ height: "200px" }}
                    >
                      {selectedCategory?.level5 && (
                        <TextInput
                          value={formik.values.name}
                          placeholder="Input category name"
                          onChangeInput={(e) => {
                            formik.setFieldValue("name", e.target.value);
                            formik.setFieldTouched("name", true, false);
                          }}
                          footer={
                            (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                              ? formik.errors.name
                              : null
                          }
                          mode={
                            (formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"
                          }
                          className="h-10"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  <div className="ml-2">
                    <PrimaryButton title="Save" type="wrap" size="large" onClick={formik.handleSubmit} />
                  </div>
                </div>
                <div className="mt-3">
                  <OutlineButton title="Cancel" type="full" size="large" onClick={onClose} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default EditCategoryModal;
