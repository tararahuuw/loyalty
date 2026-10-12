import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, DangerButton } from "sprint-asia-custom-component";

const GenerateModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  type = "default",
  addition = "state",
  placeholderTextArea,
  onChangeTextArea,
  valueTextArea,
  titleButtonLeft = "Cancel",
  titleButtonRight = "Okay",
  leftAction = onClose,
  rightAction = onClose,
  fileUploaded,
  textInputValue,
  formatItems = [],
  exampleSKU = "",
}) => {
  const cancelButtonRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const isButtonActive = () => {
    if (addition === "textarea") {
      // Check if valueTextArea is a string before calling .trim()
      return typeof valueTextArea === "string" && valueTextArea.trim() !== "";
    } else if (addition === "dropzone&input") {
      return fileUploaded && typeof textInputValue === "string" && textInputValue.trim() !== "";
    } else if (addition === "state") {
      return true;
    }
    return false;
  };

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleBackgroundClick} />
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
              <div className="flex justify-between py-3 px-5">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-3 px-6">
                <div className="mb-2">
                  <p className="text-neutral500 mb-2">Format :</p>
                  <div className="flex gap-2 flex-wrap">
                    {formatItems.map((item, idx) => (
                      <p
                        key={idx}
                        className="px-2 py-1 rounded-full bg-primary50 text-primary300 text-xs font-semibold"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-neutral500 mb-2">Example :</p>
                  <div className="flex gap-2">
                    <p className="px-2 py-1 rounded-full bg-success50 text-success300 text-xs font-semibold">
                      {exampleSKU}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  {type === "default" ? (
                    <div className="ml-2">
                      <PrimaryButton
                        title={titleButtonRight}
                        type="wrap"
                        size="large"
                        onClick={rightAction}
                        isActive={isButtonActive()}
                      />
                    </div>
                  ) : (
                    <div className="ml-2">
                      <DangerButton
                        title={titleButtonRight}
                        type="wrap"
                        size="large"
                        onClick={rightAction}
                        isActive={isButtonActive()}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <OutlineButton title={titleButtonLeft} type="full" size="large" onClick={leftAction} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default GenerateModal;
