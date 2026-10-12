import React from "react";  
import Modal from "../Modal/Modal";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

const ModalResult = (props) => {
  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-80">
        <div className="bg-white px-4 pb-4 pt-4 sm:p-4 text-center">
          <div className="flex justify-center items-center my-1">
            {props.type == "success" ? (
              <CheckCircle weight="fill" className="text-success500" size={60} />
            ) : (
              <XCircle weight="fill" className="text-danger500" size={60}/>
            )}
          </div>
          <p className="text-xl text-black font-semibold">{props.type == "success" ? "Success" : "Failed"}</p>
          <p className="text-sm text-black mb-2">{props.subtitle}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalResult;
