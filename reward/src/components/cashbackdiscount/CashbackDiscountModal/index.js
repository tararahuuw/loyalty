import React, { Fragment, useRef, useState } from "react";
import { useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "prezent/useDisclosure";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextInput,
  TextArea,
  DropdownText,
  PrimaryButton,
  OutlineButton,
  ModalResult,
  Switch,
} from "sprint-asia-custom-component";
import { GetCategoryList } from "../../../service/voucherManagement/endpoint/goodsManagement";
import DatePickerCustom from "../../DatePickerCustom";

const CashbackDiscountModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  subtitle = "Subtitle Modal",
  titleButtonLeft = "Cancel",
  titleButtonRight = "Submit",
  leftAction = onClose,
  rightAction = onClose,
  mode = "add",
  initialValues,
}) => {
  const cancelButtonRef = useRef(null);

  const [isChecked, setIsChecked] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: initialValues.id || "",
      type: initialValues.type || "",
      name: initialValues.name || "",
      maxAmount: initialValues.maxAmount || "",
      cashbackPercentage: initialValues.cashbackPercentage || "",
      validityStart: initialValues.validityStart || "",
      validityEnd: initialValues.validityEnd || "",
      description: initialValues.description || "",
      status: initialValues.status || "Active",
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      type: yup.string().required("Category is required"),
      name: yup.string().max(100, "Cashback name must be 100 characters long").required("Cashback name is required"),
      cashbackPercentage: yup
        .number()
        .min(1, "Cashback Percentage minimum 1")
        .max(99999, "Cashback Percentage maximum 99.999")
        .required("Cashback Percentage is required"),
      maxAmount: yup.number().min(0, "Maximum Amount minimum 0").required("Maximum Amount is required"),
      validityStart: yup.date().required("Start date is required"),
      validityEnd: yup
        .date()
        .min(yup.ref("validityStart"), "End date must be later than start date")
        .required("End date is required"),
      description: yup.string().max(500, "Description must be 500 characters long"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (mode === "edit") {
        rightAction({ ...values, mode: "edit" });
      } else {
        rightAction({ ...values, mode: "add" });
      }
      resetForm();
    },
  });

  useEffect(() => {
    if (mode === "edit") {
      setIsChecked(initialValues.status === "Active");
    }
  }, [initialValues?.status]);

  const handleToggle = () => {
    setIsChecked((prevState) => {
      const newStatus = !prevState;
      formik.setFieldValue("status", newStatus ? "Active" : "Inactive");
      return newStatus;
    });
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => {}} />
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
            <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full">
              <div className="flex justify-between py-3 px-3">
                <div>
                  <p className="font-semibold text-xl text-black">{title}</p>
                  <p className="font-normal text-xs text-neutral300">{subtitle}</p>
                </div>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>

              <div className="border-t border-b border-neutral30 bg-neutral20 px-8 py-4">
                <div className="py-4 px-8 rounded-lg bg-white">
                  <p className="font-semibold text-black text-lg">Cashback & Discount information</p>
                  <hr className="text-neutral30" />
                  <div className="flex gap-4 pt-4">
                    <div className="w-full">
                      <DropdownText
                        title="Type"
                        placeholder="Select Type"
                        options={[
                          {
                            option: "Cashback",
                            value: "Cashback",
                          },
                          {
                            option: "Discount",
                            value: "Discount",
                          },
                        ]}
                        isRequired
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
                        currentOption={formik.values.type}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3">
                    <div className="w-full">
                      <TextInput
                        title={`${formik.values.type} Name`}
                        placeholder={`Enter ${formik.values.type} Name`}
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
                        isRequired
                        value={formik.values.name}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3">
                    <div className="w-1/2">
                      <TextInput
                        title={`${formik.values.type} Percentage (%)`}
                        placeholder="Enter percentage"
                        onChangeInput={(e) => {
                          formik.setFieldValue("cashbackPercentage", e.target.value);
                          formik.setFieldTouched("cashbackPercentage", true, false);
                        }}
                        footer={
                          (formik.touched.cashbackPercentage || formik.submitCount > 0) &&
                          formik.errors.cashbackPercentage
                            ? formik.errors.cashbackPercentage
                            : null
                        }
                        mode={
                          (formik.touched.cashbackPercentage || formik.submitCount > 0) &&
                          formik.errors.cashbackPercentage
                            ? "danger"
                            : "default"
                        }
                        isRequired
                        type="number"
                        minimum={0}
                        value={formik.values.cashbackPercentage}
                      />
                    </div>
                    <div className="w-1/2">
                      <TextInput
                        title="Maximum Amount (IDR)"
                        placeholder="Enter max amount"
                        onChangeInput={(e) => {
                          formik.setFieldValue("maxAmount", e.target.value);
                          formik.setFieldTouched("maxAmount", true, false);
                        }}
                        footer={
                          (formik.touched.maxAmount || formik.submitCount > 0) && formik.errors.maxAmount
                            ? formik.errors.maxAmount
                            : null
                        }
                        mode={
                          (formik.touched.maxAmount || formik.submitCount > 0) && formik.errors.maxAmount
                            ? "danger"
                            : "default"
                        }
                        isRequired
                        leftAdornment={<p>Rp</p>}
                        value={formik.values.maxAmount}
                        type="number"
                        minimum={0}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-normal text-black">
                      Validity Period<span className="text-danger500 ml-1">*</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-1">
                    <div className="w-1/2">
                      <DatePickerCustom
                        title=""
                        placeholder="Start of period"
                        isRequired
                        onChange={(e) => {
                          formik.setFieldValue("validityStart", e);
                          formik.setFieldTouched("validityStart", true, false);
                        }}
                        footer={
                          (formik.touched.validityStart || formik.submitCount > 0) && formik.errors.validityStart
                            ? formik.errors.validityStart
                            : null
                        }
                        mode={
                          (formik.touched.validityStart || formik.submitCount > 0) && formik.errors.validityStart
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.validityStart}
                        className="w-full"
                      />
                    </div>
                    <div className="w-1/2">
                      <DatePickerCustom
                        title=""
                        placeholder="End of period"
                        isRequired
                        onChange={(e) => {
                          formik.setFieldValue("validityEnd", e);
                          formik.setFieldTouched("validityEnd", true, false);
                        }}
                        footer={
                          (formik.touched.validityEnd || formik.submitCount > 0) && formik.errors.validityEnd
                            ? formik.errors.validityEnd
                            : null
                        }
                        mode={
                          (formik.touched.validityEnd || formik.submitCount > 0) && formik.errors.validityEnd
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.validityEnd}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3">
                    <div className="w-full">
                      <TextArea
                        title="Description"
                        placeholder="Enter Product Description"
                        onChangeInput={(e) => {
                          formik.setFieldValue("description", e.target.value);
                          formik.setFieldTouched("description", true, false);
                        }}
                        footer={
                          (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                            ? formik.errors.description
                            : null
                        }
                        mode={
                          (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.description}
                      />
                    </div>
                  </div>
                </div>

                <div className="py-4 px-8 rounded-lg bg-white mt-4">
                  <p className="font-semibold text-black text-lg">Status</p>
                  <hr className="text-neutral30" />
                  <div className="flex mt-3">
                    <span className="mr-3 font-semibold">Activate your Cashback & Discount</span>
                    <Switch onChange={handleToggle} checked={isChecked} isEdit />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  <div className="ml-2">
                    <PrimaryButton title={titleButtonRight} type="wrap" size="large" onClick={formik.handleSubmit} />
                  </div>
                </div>
                <div className="mt-3">
                  <OutlineButton title={titleButtonLeft} type="full" size="large" onClick={leftAction} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default CashbackDiscountModal;
