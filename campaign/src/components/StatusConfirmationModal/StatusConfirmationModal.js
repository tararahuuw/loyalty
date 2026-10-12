import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton, DangerButton } from "sprint-asia-custom-component";
import moment from "moment";

const StatusConfirmationModal = ({ isOpen, onClose, onClick, status, startDate }) => {
  const cancelButtonRef = useRef(null);
  const start = new Date(startDate);
  const today = new Date();

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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">
                  {status === "active" || status === "scheduled" ? "Deactivate Campaign?" : "Activate Campaign?"}
                </p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <XIcon size={24} />
                </p>
              </div>
              {status === "active" || status === "scheduled" ? (
                <div className="border-t border-b border-neutral30 py-6 flex flex-col text-lg text-neutral500 px-6">
                  <p>This action will deactivate the campaign and stop all ongoing activities.</p>
                  <div>
                    <span className="font-bold">Note: </span>
                    <span>Customers will no longer be able to access or benefit from this campaign.</span>
                  </div>

                  <p className="mt-4">Are you sure you want to continue?</p>
                </div>
              ) : (
                <div className="border-t border-b border-neutral30 py-6 flex flex-col text-lg text-neutral500 px-6">
                  <p>
                    This action will activate the campaign and make it available to customers. Are you sure you want to
                    continue?
                  </p>
                  <div>
                    <span className="font-bold">Note: </span>
                    <span>
                      Customers will be able to access and benefit from this campaign, and the campaign status will
                      update to
                    </span>

                    {start > today ? (
                      <span className="font-bold"> Scheduled.</span>
                    ) : (
                      <span className="font-bold"> Active.</span>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 flex items-center justify-end p-4 gap-4">
                <div>
                  <OutlineButton title="Cancel" onClick={onClose} />
                </div>

                <div>
                  {status === "active" || status === "scheduled" ? (
                    <DangerButton title="Yes, Deactivate" onClick={() => onClick("inactive")} />
                  ) : (
                    <PrimaryButton title="Yes, Activate" onClick={() => onClick("active")} />
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default StatusConfirmationModal;
