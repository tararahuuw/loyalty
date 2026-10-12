import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { OutlineButton } from "sprint-asia-custom-component";
import StatusSection from "./StatusSection";
import VoucherInformationSection from "./VoucherInformationSection";
import VoucherDetailSection from "./VoucherDetailSection";
import LandingPagePreviewSection from "./LandingPagePreviewSection";
import { useFetch } from "prezent/useFetch";
import { GetVoucherDetail } from "../../service/voucherManagement/endpoint/voucherManagement";

const VoucherModal = ({ voucherId, isOpen, onClose }) => {
  const headerRef = useRef(null);
  const { data: voucher } = useFetch(voucherId && GetVoucherDetail, "voucher-detail", [], voucherId);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative bg-primary300"
        initialFocus={headerRef}
        onClose={onClose}
        static={true}
        style={{
          zIndex: 1001,
        }}
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

        <div className="fixed inset-0 w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
                <div className="flex justify-between py-3 px-6" ref={headerRef}>
                  <p className="font-semibold text-xl text-black">Detail Voucher</p>
                  <a className="cursor-pointer" onClick={onClose}>
                    <X size={24} />
                  </a>
                </div>

                <div
                  className="grid grid-cols-6 gap-4 bg-neutral20 px-8 py-4 overflow-y-auto"
                  style={{ maxHeight: 500 }}
                >
                  <div className="col-span-4 space-y-6">
                    <StatusSection status={voucher?.data?.status} />

                    <VoucherInformationSection
                      name={voucher?.data?.name}
                      type={voucher?.data?.type}
                      category={voucher?.data?.category}
                    />

                    <VoucherDetailSection
                      denom={voucher?.data?.denom}
                      price={voucher?.data?.price}
                      stock={voucher?.data?.stock}
                      description={voucher?.data?.description}
                      howToRedeem={voucher?.data?.howToRedeem}
                      termAndCondition={voucher?.data?.termAndCondition}
                      endDate={voucher?.data?.endDate}
                      startDate={voucher?.data?.startDate}
                    />
                  </div>

                  <div className="col-span-2">
                    <LandingPagePreviewSection
                      name={voucher?.data?.name}
                      refID={1234567890}
                      validDate={voucher?.data?.endDate}
                      title={voucher?.data?.messageTitle}
                      message={voucher?.data?.message}
                      description={voucher?.data?.description}
                      howToRedeem={voucher?.data?.howToRedeem}
                      termAndCondition={voucher?.data?.termAndCondition}
                      image={voucher?.data?.imageUrl}
                    />
                  </div>
                </div>

                <div className="p-4 flex gap-2 justify-end">
                  <OutlineButton title="Close" onClick={onClose} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default VoucherModal;
