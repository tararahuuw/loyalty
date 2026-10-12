import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import StatusSection from "../../shared/StatusSection";
import ModalBasicInformationSection from "./ModalBasicInformationSection";
import { useDisclosure } from "prezent/useDisclosure";
import ConfirmationModal from "../../shared/ConfirmationModal";

const AddSingleProductModal = ({
  isOpen,
  onClose,
  parentFormik,
  selectedProduct,
  roleAccess,
  onSubmit,
  categories,
  setSelectedProduct = () => {},
}) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);

  const handleToggleConfirmationModal = () => {
    onClose();
    toggleConfirmationModal();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      skuId: selectedProduct?.skuId || "",
      productName: selectedProduct?.productName || "",
      category: selectedProduct?.category || "",
      status: selectedProduct?.status ?? true,
    },
    validationSchema: yup.object().shape({
      skuId: yup
        .string()
        .matches(
          /^[A-Za-z0-9_-]+$/,
          "Code can only contain letters, numbers, hyphens (-), and underscores (_), no spaces"
        )
        .min(5, "SKU / ID must be at least 5 characters")
        .max(30, "SKU / ID cannot be more than 30 characters")
        .required("SKU / ID is required"),
      productName: yup
        .string()
        .matches(/^[A-Za-z0-9 .\-&']+$/, "Product Name can only contain letters, numbers, spaces, and symbols: - . & '")
        .min(3, "Product Name must be at least 3 characters")
        .max(50, "Product Name cannot be more than 50 characters")
        .required("Product Name is required"),
      category: yup.string().required("Category is required"),
      status: yup.boolean().required("Status is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      if (roleAccess === "System Administrator") {
        const isEditMode = Boolean(selectedProduct);

        // Check if skuId exists in another product (excluding the one being edited)
        const isSkuIdExists = parentFormik.values.products.some((product) => {
          if (isEditMode && product.skuId === selectedProduct.skuId) {
            return false;
          }
          return product.skuId === values.skuId;
        });

        if (isSkuIdExists) {
          formik.setFieldError("skuId", "SKU ID already exists.");
          return;
        }

        if (isEditMode) {
          const updatedProducts = parentFormik.values.products.map((product) =>
            product.skuId === selectedProduct.skuId ? { ...selectedProduct, ...values } : product
          );
          parentFormik.setFieldValue("products", updatedProducts);
        } else {
          const updatedProducts = [{ ...values }, ...parentFormik.values.products];
          parentFormik.setFieldValue("products", updatedProducts);
        }

        setSelectedProduct(null);
        resetForm();
        onClose();
      } else {
        onSubmit(values, resetForm);
      }
    },
  });

  const handleToggle = () => {
    formik.setFieldValue("status", !formik.values.status);
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={() => {
            if (formik.dirty) {
              handleToggleConfirmationModal();
            } else {
              onClose();
              setSelectedProduct(null);
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
              <Dialog.Panel className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl py-3 flex flex-col gap-4">
                <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
                  <p className="font-semibold text-xl text-black">
                    {!selectedProduct ? "Add Product" : "Edit Product"}
                  </p>
                  <p
                    className="cursor-pointer text-xl"
                    onClick={() => {
                      if (formik.dirty) {
                        handleToggleConfirmationModal();
                      } else {
                        onClose();
                        setSelectedProduct(null);
                        formik.resetForm();
                      }
                    }}
                  >
                    <X size={24} />
                  </p>
                </div>

                <div className="flex flex-col px-6 py-3 gap-10">
                  <StatusSection handleToggle={handleToggle} isChecked={formik.values.status} itemName="Product" />

                  <ModalBasicInformationSection formik={formik} categories={categories} />
                </div>

                <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                  <OutlineButton
                    title="Cancel"
                    onClick={() => {
                      if (formik.dirty) {
                        handleToggleConfirmationModal();
                      } else {
                        onClose();
                        setSelectedProduct(null);
                        formik.resetForm();
                      }
                    }}
                  />
                  <PrimaryButton title="Submit" onClick={formik.handleSubmit} />
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
          setSelectedProduct(null);
        }}
        onClose={handleToggleConfirmationModal}
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        title="Do you want to cancel?"
      />
    </>
  );
};

export default AddSingleProductModal;
