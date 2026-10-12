import React from "react";
import { XIcon } from "@phosphor-icons/react";
import { DangerButton, OutlineButton } from "sprint-asia-custom-component";
import TextArea from "prezent/TextArea";
import Modal from "prezent/Modal";

const ModalRejectCampaign = ({ formik, isOpen, onClose, onClick }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="max-w-lg">
        <div className="flex justify-between py-3 px-4 border-b border-neutral40">
          <p className="font-semibold text-xl">Reject Campaign</p>

          <a className="cursor-pointer" onClick={onClose}>
            <XIcon size={24} />
          </a>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <p>Please provide a reason for rejecting this campaign. Your feedback will be shared with the requester.</p>

          <TextArea
            title=""
            lengthChecker={false}
            height={40}
            onChange={(e) => {
              formik.setFieldValue("reason", e.target.value);
              formik.setFieldTouched("reason", true, false);
            }}
            value={formik.values.reason}
            footer={
              (formik.touched.reason || formik.submitCount > 0) && formik.errors.reason ? formik.errors.reason : null
            }
            mode={(formik.touched.reason || formik.submitCount > 0) && formik.errors.reason ? "danger" : "default"}
          />
        </div>

        <div className="flex gap-2 justify-end w-full p-4">
          <OutlineButton title="Cancel" onClick={onClose} />
          <DangerButton title="Reject" onClick={onClick} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalRejectCampaign;
