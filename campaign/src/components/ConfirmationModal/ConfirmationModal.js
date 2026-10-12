import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const ConfirmationModal = ({ title, subtitle, isOpen, onClose, onClick }) => {
  const cancelButtonRef = useRef(null);
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <XIcon size={24} />
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-6">
                <p className="font-normal text-lg text-neutral500 px-6">{subtitle}</p>
              </div>
              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  <div className="ml-2">
                    <PrimaryButton title="Cancel" type="wrap" size="large" onClick={onClick} />
                  </div>
                </div>
                <div className="mt-3">
                  <OutlineButton title="Back" type="full" size="large" onClick={onClose} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmationModal;
