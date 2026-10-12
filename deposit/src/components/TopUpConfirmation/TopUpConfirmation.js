import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, FilePdf, FileImage } from "@phosphor-icons/react";
import { Alert, OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const TopUpConfirmation = ({ isOpen, onClose, formik }) => {
  const cancelButtonRef = useRef(null);
  const mimeType = formik.values.paymentReceipt?.type;

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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 flex flex-col gap-4">
              <div className="flex justify-between px-6 pb-3 border-b-2 border-neutral30">
                <p className="font-semibold text-xl text-black">Top-up Confirmation</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <X size={24} />
                </p>
              </div>

              <div className="px-6 pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-neutral80">Client Name</p>
                  <p className="text-black">{formik.values.clientName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-neutral80">Division Name</p>
                  <p className="text-black">{formik.values.divisionName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-neutral80">Balance Top-Up</p>
                  <p className="text-black">Rp{Number(formik.values.amount).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-neutral80">Payment Receipt</p>
                  <div className="flex items-center gap-1">
                    {formik.values.paymentReceipt ? (
                      <>
                        {mimeType === "application/pdf" ? <FilePdf /> : <FileImage />}
                        <p className="text-black">{formik.values.paymentReceipt.name}</p>
                      </>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </div>

                <Alert subtitle="By clicking the submit below, the entered amount will be added to the client's deposit" />
              </div>

              <div className="flex px-6 gap-2 justify-end">
                <OutlineButton title="Cancel" onClick={onClose} />
                <PrimaryButton title="Submit" onClick={formik.handleSubmit} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default TopUpConfirmation;
