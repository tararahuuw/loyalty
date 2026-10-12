import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PrimaryButton from "../../button/primarybutton";
import OutlineButton from "../../button/outlinebutton";
import DangerButton from "../../button/dangerbutton";
import Dropzone from "../../dropzone/uploadfile";
import TextInput from "../../textinput";
import TextEditor from "../../texteditor";

const ModalState = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  subtitle = "Subtitle Modal",
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
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-6">
                <p className="font-normal text-lg text-neutral500 px-6">{subtitle}</p>
                {addition == "textarea" && (
                  <div className="py-3 px-6">
                    <textarea
                      value={valueTextArea}
                      onChange={onChangeTextArea}
                      placeholder={placeholderTextArea}
                      className="w-full p-3.5 text-sm text-neutral300 border border-neutral50 rounded-md bg-neutral20 focus:outline-none"
                    />
                  </div>
                )}
                {addition == "dropzone&input" && (
                  <div className="py-3 px-6">
                    <div>
                      <Dropzone />
                    </div>
                    <div className="pt-3">
                      <TextInput title="Limit Amount" />
                    </div>
                  </div>
                )}
                {addition === "texteditor" && (
                  <div className="py-3 px-6">
                    <TextEditor
                      value={valueTextArea}
                      onChange={onChangeTextArea}
                      title="Your Decline Reason"
                      placeholder="Please provide a detailed reason for the decline."
                    />
                  </div>
                )}
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

export default ModalState;
