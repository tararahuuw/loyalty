import React from "react";
import { Info } from "@phosphor-icons/react";
import Modal from "../Modal/Modal";

const LoadingModal = (props) => {
  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <div className="bg-white p-4 rounded-md" style={{ width: "512px" }}>
        <div className="flex">
          <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <Info className="h-8 w-8 text-primary500" />
          </div>
          <div className="text-left sm:ml-4 sm:mt-0">
            <p className="text-base font-semibold leading-6 text-black">{props.title}</p>
            <div className="mt-2">
              <p className="text-sm text-black">{props.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;
