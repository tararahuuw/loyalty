import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, DownloadSimple, FilePdf } from "@phosphor-icons/react";
import { OutlineButton } from "sprint-asia-custom-component";

const ReceiptModal = ({ isOpen, onClose, title, receipt = "", onClick, id }) => {
  const cancelButtonRef = useRef(null);
  const receiptMimeType = receipt?.split(".");

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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 px-6 flex flex-col gap-4">
              <div className="flex justify-between">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <X size={24} />
                </p>
              </div>

              <div className="flex items-center px-4 border border-neutral50 rounded-lg py-2">
                {/* <Receipt /> */}
                {receiptMimeType[1] === "pdf" ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-neutral80">Payment Receipt</p>
                    <div className="flex items-center gap-2">
                      <FilePdf />
                      <a
                        target="_blank"
                        className="text-black cursor-pointer hover:underline focus:outline-none"
                        href={`${process.env.REACT_APP_API_URL}/deposit/${receipt}`}
                      >
                        {receipt}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <img
                      alt={receipt}
                      src={`${process.env.REACT_APP_API_URL}/deposit/${receipt}`}
                      className="object-contain"
                      style={{
                        maxWidth: "250px",
                        maxHeight: "420px",
                      }}
                    />
                  </div>
                )}
              </div>

              {receiptMimeType[1] !== "pdf" && (
                <OutlineButton
                  isIconVisible
                  icon={<DownloadSimple />}
                  title="Download Receipt"
                  onClick={() => onClick(receipt, id)}
                />
              )}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default ReceiptModal;
