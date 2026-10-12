import React, { useRef, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { DropdownText, DropzoneUploadFile, PrimaryButton, TextInput } from "sprint-asia-custom-component";

const TopUpModal = ({ isOpen, onClose, title, formik, clients, divisions, handleClick }) => {
  const cancelButtonRef = useRef(null);

  const onDropReceipt = useCallback((acceptedFiles) => {
    formik.setFieldValue("paymentReceipt", acceptedFiles[0]);
  }, []);
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 flex flex-col">
              <div className="flex justify-between px-6 py-2">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <X size={24} />
                </p>
              </div>
              <div className="flex flex-col gap-4 px-6 py-2 border-t-2 border-b-2 border-neutral40">
                <p className="font-semibold text-lg text-black">Client Information</p>

                <DropdownText
                  title="Client"
                  placeholder="Select Client"
                  options={clients?.data?.map(({ name, id }) => ({
                    option: name,
                    value: id,
                  }))}
                  isRequired
                  onSelect={(e) => {
                    formik.setFieldValue("clientId", e.value);
                    formik.setFieldValue("clientName", e.option);
                  }}
                  currentOption={formik.values.clientId}
                  footer={formik.errors.clientId}
                  mode={formik.errors.clientId ? "danger" : "default"}
                />

                <DropdownText
                  title="Division"
                  placeholder="Select Division"
                  options={divisions?.data?.map(({ name, id }) => ({
                    option: name,
                    value: id,
                  }))}
                  isRequired
                  onSelect={(e) => {
                    formik.setFieldValue("divisionId", e.value);
                    formik.setFieldValue("divisionName", e.option);
                  }}
                  currentOption={formik.values.divisionId}
                  footer={formik.errors.divisionId}
                  mode={formik.errors.divisionId ? "danger" : "default"}
                />

                <p className="font-semibold text-lg text-black">Amount</p>

                <TextInput
                  title="Balance Top-Up"
                  placeholder="Input balance"
                  type="number"
                  footer={formik.errors.amount}
                  isRequired
                  onChangeInput={(e) => formik.setFieldValue("amount", e.target.value)}
                  mode={formik.errors.amount ? "danger" : "default"}
                  value={formik.values.amount}
                  leftAdornment={<p className="font-normal text-neutral300 text-xs">Rp</p>}
                />

                <DropzoneUploadFile
                  title="Payment Receipt"
                  required={false}
                  subtitle="Format File PDF, JPEG, JPG, Maximal File 5 MB"
                  onDrop={onDropReceipt}
                  selectedFile={formik.values.paymentReceipt}
                  maxFiles={1}
                  error={formik.errors.paymentReceipt}
                />
              </div>

              <div className="px-6 pt-3">
                <PrimaryButton title="Top-up" type="full" onClick={handleClick} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default TopUpModal;
