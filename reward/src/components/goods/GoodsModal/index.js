import React, { Fragment, useRef, useState } from "react";
import { useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "prezent/useDisclosure";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextInput, TextArea, DropdownText, PrimaryButton, OutlineButton, Switch } from "sprint-asia-custom-component";
import { GetCategoryList } from "../../../service/voucherManagement/endpoint/goodsManagement";
import DatePickerCustom from "../../DatePickerCustom";
import UploadImage from "../../UploadImage";
import ResultModal from "prezent/ResultModal";

const GoodsModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  subtitle = "Subtitle Modal",
  type = "default",
  addition = "state",
  titleButtonLeft = "Cancel",
  titleButtonRight = "Submit",
  leftAction = onClose,
  rightAction = onClose,
  mode = "add",
  initialValues = {},
  parameterId = null,
}) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [isActive, setIsActive] = useState(false);

  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

  const onDropFileGoodsImage = useCallback((acceptedFiles) => {
    formik.setFieldValue("images", acceptedFiles[0] || "");
    formik.setFieldTouched("images", true, false);
  }, []);

  const formik = useFormik({
    initialValues: {
      id: initialValues.id || "",
      categoryID: initialValues.categoryID || "",
      name: initialValues.name || "",
      pointRequired: initialValues.pointRequired || "",
      stock: initialValues.stock || "",
      startDate: initialValues.startDate || "",
      endDate: initialValues.endDate || "",
      description: initialValues.description || "",
      images: initialValues.images?.[0]?.url || null,
      status: initialValues.status || "active",
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      categoryID: yup.string().required("Category is required"),
      name: yup.string().max(100, "Goods name must be 100 characters long").required("Goods name is required"),
      pointRequired: yup
        .number()
        .min(1, "Point required minimum 1")
        .max(9999999, "Point required maximum 9.999.999")
        .required("Points required"),
      stock: yup.number().min(1, "Stock minimum 1").max(99999, "Stock maximum 99.999").required("Stock is required"),
      startDate: yup.date().required("Start date is required"),
      endDate: yup
        .date()
        .min(yup.ref("startDate"), "End date must be later than start date")
        .required("End date is required"),
      description: yup.string().max(500, "Description must be 500 characters long").required("Description is required"),
      images: yup.string().required("Images is required"),
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
      formik.setFieldValue("status", newStatus ? "active" : "inactive");
      return newStatus;
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetCategoryList({});
        if (Array.isArray(res?.data)) {
          const mappedOptions = res.data.map((item) => ({
            option: item.name,
            value: item.id,
          }));
          setCategoryOptions(mappedOptions);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

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
            {/* <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
             */}
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

              <div className="border-t border-b border-neutral30 py-2 px-2">
                <div className="py-2 px-2">
                  <div className="flex gap-4 pt-3">
                    <div className="w-1/2">
                      <DropdownText
                        title="Category"
                        placeholder="Select Category"
                        options={categoryOptions}
                        isRequired
                        onSelect={(e) => {
                          formik.setFieldValue("categoryID", e.value);
                          formik.setFieldTouched("categoryID", true, false);
                        }}
                        footer={
                          (formik.touched.categoryID || formik.submitCount > 0) && formik.errors.categoryID
                            ? formik.errors.categoryID
                            : null
                        }
                        mode={
                          (formik.touched.categoryID || formik.submitCount > 0) && formik.errors.categoryID
                            ? "danger"
                            : "default"
                        }
                        currentOption={formik.values.categoryID}
                      />
                    </div>
                    <div className="w-1/2">
                      <TextInput
                        title="Goods Name"
                        placeholder="Enter Goods Name"
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
                        title="Point Required"
                        placeholder="Enter Point Required"
                        onChangeInput={(e) => {
                          formik.setFieldValue("pointRequired", e.target.value);
                          formik.setFieldTouched("pointRequired", true, false);
                        }}
                        footer={
                          (formik.touched.pointRequired || formik.submitCount > 0) && formik.errors.pointRequired
                            ? formik.errors.pointRequired
                            : null
                        }
                        mode={
                          (formik.touched.pointRequired || formik.submitCount > 0) && formik.errors.pointRequired
                            ? "danger"
                            : "default"
                        }
                        isRequired
                        value={formik.values.pointRequired}
                      />
                    </div>
                    <div className="w-1/2">
                      <TextInput
                        title="Stock"
                        placeholder="Enter Stock"
                        onChangeInput={(e) => {
                          formik.setFieldValue("stock", e.target.value);
                          formik.setFieldTouched("stock", true, false);
                        }}
                        footer={
                          (formik.touched.stock || formik.submitCount > 0) && formik.errors.stock
                            ? formik.errors.stock
                            : null
                        }
                        mode={
                          (formik.touched.stock || formik.submitCount > 0) && formik.errors.stock ? "danger" : "default"
                        }
                        isRequired
                        value={formik.values.stock}
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
                          formik.setFieldValue("startDate", e);
                          formik.setFieldTouched("startDate", true, false);
                        }}
                        footer={
                          (formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate
                            ? formik.errors.startDate
                            : null
                        }
                        mode={
                          (formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.startDate}
                        className="w-full"
                      />
                    </div>
                    <div className="w-1/2">
                      <DatePickerCustom
                        title=""
                        placeholder="End of period"
                        isRequired
                        onChange={(e) => {
                          formik.setFieldValue("endDate", e);
                          formik.setFieldTouched("endDate", true, false);
                        }}
                        footer={
                          (formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate
                            ? formik.errors.endDate
                            : null
                        }
                        mode={
                          (formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate
                            ? "danger"
                            : "default"
                        }
                        value={formik.values.endDate}
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
                        isRequired
                        value={formik.values.description}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-1">
                    <UploadImage
                      onDrop={onDropFileGoodsImage}
                      selectedFile={formik.values.images}
                      title="Product Image"
                      subtitle={false}
                      required={true}
                      error={
                        (formik.touched.images || formik.submitCount > 0) && formik.errors.images
                          ? formik.errors.images
                          : null
                      }
                    />
                  </div>
                  <div className="flex mt-3">
                    <Switch onChange={handleToggle} checked={isChecked} isEdit />
                    <span className="ml-3">Active</span>
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
                <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default GoodsModal;
