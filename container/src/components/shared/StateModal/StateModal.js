import React from "react";
import { PrimaryButton, OutlineButton, DangerButton } from "sprint-asia-custom-component";
import Modal from "../Modal/Modal";

const ModalState = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  subtitle = "Subtitle Modal",
  type = "default",
  titleButtonLeft = "Cancel",
  titleButtonRight = "Okay",
  leftAction = onClose,
  rightAction = onClose,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="max-w-lg">
        <div className="flex justify-between py-3 px-6">
          <p className="font-semibold text-xl text-black">{title}</p>
          <p className="cursor-pointer text-xl" onClick={onClose}>
            x
          </p>
        </div>
        <div className="border-t border-b border-neutral30 py-6">
          <p className="font-normal text-lg text-neutral500 px-6">{subtitle}</p>
        </div>
        <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
          <div className="my-3">
            {type === "default" ? (
              <div className="ml-2">
                <PrimaryButton title={titleButtonRight} type="wrap" size="large" onClick={rightAction} />
              </div>
            ) : (
              <div className="ml-2">
                <DangerButton title={titleButtonRight} type="wrap" size="large" onClick={rightAction} />
              </div>
            )}
          </div>
          <div className="mt-3">
            <OutlineButton title={titleButtonLeft} type="full" size="large" onClick={leftAction} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalState;
