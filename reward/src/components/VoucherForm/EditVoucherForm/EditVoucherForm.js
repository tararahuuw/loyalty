import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, CalendarBlank } from "@phosphor-icons/react";
import { TextInput, Switch, OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import TextArea from "prezent/TextArea";

const EditVoucherForm = ({ isOpen, onClose }) => {
  const cancelButtonRef = useRef(null);

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
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Edit Voucher</p>
                  <a className="cursor-pointer" onClick={onClose}>
                    <X size={24} />
                  </a>
                </div>
                <div className="w-full p-4 border-t border-b border-neutral30 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      title="Name"
                      placeholder="Input Voucher Name"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                    />

                    <TextInput
                      title="Type"
                      placeholder="Input Voucher Type"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <TextInput
                      title="Name"
                      placeholder="Input Voucher Name"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                    />
                    <TextInput
                      title="Category"
                      placeholder="Input Voucher Category"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                    />
                    <TextInput
                      title="Available Stock"
                      placeholder="Input Available Stock"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      title="Valid From"
                      placeholder="Input Start Date"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                      leftAdornment={<CalendarBlank />}
                    />

                    <TextInput
                      title="Valid To"
                      placeholder="Input End Date"
                      onChangeInput={(e) => {}}
                      isRequired={false}
                      mode="disable"
                      leftAdornment={<CalendarBlank />}
                    />
                  </div>

                  <TextArea
                    title="Description (Optional)"
                    placeholder="Input Description"
                    onChange={(e) => {}}
                    isRequired={false}
                    lengthChecker={false}
                    height={40}
                  />

                  <TextArea
                    title="Terms & Conditions (Optional)"
                    placeholder="Input Terms & Conditions"
                    onChange={(e) => {}}
                    isRequired={false}
                    lengthChecker={false}
                    height={40}
                  />

                  <div className="flex items-center gap-2">
                    <Switch onChange={() => {}} checked={true} isEdit />
                    <p className="text-sm">Active Status</p>
                  </div>
                </div>

                <div className="p-4 flex gap-2 justify-end">
                  <OutlineButton title="Cancel" onClick={onClose} />
                  <PrimaryButton title="Update Voucher" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditVoucherForm;
