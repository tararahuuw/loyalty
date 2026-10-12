import React from "react";
import { XIcon } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import DangerButton from "../DraftModal/DangerButton";
import Modal from "prezent/Modal";

const ModalConfirmation = ({ isOpen, onClose, onDiscard, onClick }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex justify-between py-3 px-6">
        <p className="font-semibold text-xl text-black">Confirmation</p>
        <p className="cursor-pointer text-xl" onClick={onClose}>
          <XIcon size={24} />
        </p>
      </div>
      <div className="border-t border-b border-neutral30 py-6 flex flex-col gap-2">
        <p className="text-base text-neutral500 px-6 font-semibold">Are you sure you want to cancel?</p>
        <p className="font-normal text-sm text-neutral500 px-6">
          This action will discard all changes made to the campaign summary. Your progress will not be saved.
        </p>
      </div>
      <div className="bg-gray-50 flex items-center justify-end p-4 gap-4">
        <div>
          <DangerButton variant="outlined" title="Discard" size="large" onClick={onDiscard} />
        </div>

        <div>
          <OutlineButton title="Cancel" onClick={onClose} />
        </div>

        <div>
          <PrimaryButton title="Save as Draft" size="large" onClick={onClick} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmation;
