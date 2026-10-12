import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Circle, RadioButton } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const SandezaBillsMerchantModal = ({
  isOpen,
  onClose,
  onClick,
  onClickBack,
  selectedClient,
  selectedMerchant,
  setSelectedMerchant,
  merchants = [],
}) => {
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 flex flex-col gap-4">
              <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
                <p className="font-semibold text-xl text-black">Connect to SandezaBills</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <X size={24} />
                </p>
              </div>

              <div className="flex flex-col px-6 py-3">
                <div className="rounded-t-md bg-neutral30 px-3 py-2">Select merchant for {selectedClient?.name}</div>
                <div className="flex flex-col max-h-72 overflow-y-auto border border-neutral30 rounded-b-md">
                  {merchants.length
                    ? merchants.map((client, idx) => (
                        <a
                          key={client.id}
                          className={`flex gap-3 items-center px-3 py-2 hover:bg-neutral20 cursor-pointer ${
                            idx !== merchants.length - 1 ? "border-b border-neutral30" : ""
                          }`}
                          onClick={() => {
                            if (client.id === selectedMerchant?.id) {
                              setSelectedMerchant(null);
                            } else {
                              setSelectedMerchant(client);
                            }
                          }}
                        >
                          {client.id === selectedMerchant?.id ? (
                            <RadioButton weight="fill" className="text-primary500" />
                          ) : (
                            <Circle />
                          )}

                          <img className="rounded-full h-10 w-10 object-cover" src={client.logo} alt={client.name} />

                          <div className="flex flex-col">
                            <p className="text-black font-medium">{client.name}</p>
                            <p className="text-neutral300 font-medium text-xs">{client.email}</p>
                          </div>
                        </a>
                      ))
                    : null}
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                <OutlineButton title="Back" onClick={onClickBack} />
                <PrimaryButton title="Continue" onClick={() => onClick(selectedMerchant)} isActive={selectedMerchant} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SandezaBillsMerchantModal;
