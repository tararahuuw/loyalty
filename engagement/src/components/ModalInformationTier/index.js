import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {PiPencilFill, PiXFill, PiUsersFill, PiPencilSimpleLineFill} from "react-icons/pi";

const ModalInformationTier = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const cancelButtonRef = useRef(null);
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
        >
          <div className="min-h-screen flex items-center justify-center px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-5xl">
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Create New Specification</p>
                  <p className="cursor-pointer text-xl" onClick={onClose}>
                    ×
                  </p>
                </div>
                <div className="border-t border-b border-neutral30 py-6 px-6 text-neutral500">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="border-2 border-neutral80 rounded-lg bg-white p-4">
                            <div className="flex items-center mb-2">
                                <PiPencilSimpleLineFill size={20} className="mr-2 text-secondary600"/>
                                <p className="font-semibold text-neutral500">Tier Edit Conditions</p>
                            </div>
                            <ul className="list-disc ml-4">
                                <li>Tier not in active campaign.</li>
                                <li>Tier not set as default.</li>
                                <li>Changes do not create overlapping rule.</li>
                                <li>Tier Progress Criteria if changed then must re-evaluate all customers who move up/down.</li>
                                <li>Unique tier name for each loyalty program.</li>
                            </ul>
                        </div>
                        <div className="border-2 border-neutral80 rounded-lg bg-white p-4">
                            <div className="flex items-center mb-2">
                                <PiXFill size={20} className="mr-2 text-danger500"/>
                                <p className="font-semibold text-neutral500">Tier Delete Conditions</p>
                            </div>
                            <ul className="list-disc ml-4">
                                <li>Tier with inactive status, may be deleted directly.</li>
                                <li>Tier used by active customers may not be deleted before being deactivated.</li>
                                <li>Tier used in an active campaign must not be deleted before the campaign is completed.</li>
                            </ul>
                        </div>
                        <div className="border-2 border-neutral80 rounded-lg bg-white p-4">
                            <div className="flex items-center mb-2">
                                <PiUsersFill size={20} className="mr-2 text-primary500"/>
                                <p className="font-semibold text-neutral500">Customer Placement</p>
                            </div>
                            <ul className="list-disc ml-4">
                                <li>New customers → lowest qualifying tier</li>
                                <li>Default tier → 0 spend & 0 frequency</li>
                                <li>Automatic upgrades after transactions</li>
                                <li>Downgrades based on inactivity rules</li>
                            </ul>
                        </div>
                    </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ModalInformationTier;
