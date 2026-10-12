import React from "react";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircle, X, XCircle } from "@phosphor-icons/react";
import { PrimaryButton } from "sprint-asia-custom-component";

const ResultModal = ({ onClose, isOpen, subtitle, type }) => {
  const cancelButtonRef = useRef(null);

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 bg-primary300"
        initialFocus={cancelButtonRef}
        onClose={onClose}
        static={true}
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
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={handleBackgroundClick} />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xs">
                <X className="absolute top-4 right-4 cursor-pointer text-neutral600" size={24} />

                <div className="bg-white px-4 sm:p-4 text-center flex flex-col justify-center items-center gap-2 mt-8">
                  <div className="flex justify-center items-center">
                    {type == "success" ? (
                      <CheckCircle className="text-success500" weight="fill" size={50} />
                    ) : (
                      <XCircle className="text-danger500" weight="fill" size={50} />
                    )}
                  </div>
                  <p className="text-xl text-black font-semibold">{type == "success" ? "Success" : "Failed"}</p>
                  <p className="text-sm text-neutral700">{subtitle}</p>

                  <PrimaryButton title="OK" onClick={onClose} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ResultModal;
