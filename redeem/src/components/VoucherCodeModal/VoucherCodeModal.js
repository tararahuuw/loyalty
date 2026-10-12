import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import QRCode from "react-qr-code";
import moment from "moment";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";

const VoucherCodeModal = ({ isOpen, onClose, reward }) => {
  const cancelButtonRef = useRef(null);

  const handleCopyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
        static={false}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={(e) => e.stopPropagation()} />
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg py-3 flex flex-col gap-4 mx-2 my-2">
              <div className="flex justify-center border-b border-neutral50 px-6 pb-2">
                <Dialog.Title className="font-semibold text-xl text-black">
                  {reward?.voucherCategory === "PLN"
                    ? "Token Code"
                    : reward?.voucherCategory === "Data Package" ||
                        reward?.voucherCategory === "Paket Data" ||
                        reward?.voucherCategory === "Pulsa" ||
                        reward?.voucherCategory === "E-wallet"
                      ? "Reward Ref ID"
                      : "Reward Code"}
                </Dialog.Title>
              </div>

              <div className="flex flex-col px-8 gap-5">
                {reward?.voucherType === "PPOB" ? null : (
                  <div className="px-4">
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={reward?.redeemValue || ""}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                )}

                {reward?.voucherType !== "PPOB" && (
                  <p className="text-neutral500 font-normal">Please show this QR Code to claim the reward</p>
                )}

                <div className="bg-[#F5F6F7] p-4 rounded-md flex flex-col gap-2">
                  <p className="font-semibold">
                    {reward?.voucherCategory === "PLN"
                      ? "Token code"
                      : reward?.voucherCategory === "Data Package" ||
                          reward?.voucherCategory === "Paket Data" ||
                          reward?.voucherCategory === "Pulsa" ||
                          reward?.voucherCategory === "E-wallet"
                        ? "Reward Ref ID"
                        : "Reward Code"}
                  </p>

                  <div className="border border-neutral80 rounded-lg py-3 px-4 bg-white flex items-center justify-between gap-4">
                    {reward?.voucherCategory === "PLN" ? (
                      <p className="text-xs break-all">{reward?.redeemValue?.split("/")[0]}</p>
                    ) : reward?.voucherCategory === "Data Package" ||
                      reward?.voucherCategory === "Paket Data" ||
                      reward?.voucherCategory === "Pulsa" ||
                      reward?.voucherCategory === "E-wallet" ? (
                      <p className="text-xs break-all">{reward?.refID}</p>
                    ) : (
                      <p className="text-xs break-all">{reward?.redeemValue}</p>
                    )}

                    {reward?.voucherCategory !== "PLN" && (
                      <div className="flex justify-end">
                        <PrimaryButton
                          title={<p className="whitespace-nowrap">Copy code</p>}
                          type="full"
                          onClick={() =>
                            handleCopyVoucherCode(
                              reward?.voucherCategory === "Data Package" ||
                                reward?.voucherCategory === "Paket Data" ||
                                reward?.voucherCategory === "Pulsa" ||
                                reward?.voucherCategory === "E-wallet"
                                ? reward?.refID
                                : reward?.voucherCategory === "PLN"
                                  ? reward?.redeemValue?.split("/")[0]
                                  : reward?.redeemValue,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CalendarBlankIcon weight="fill" className="text-neutral300" size={16} />
                    <p className="text-neutral500 text-xs">Expired on</p>
                  </div>

                  <p className="text-xs font-medium">{moment(reward?.validUntil).format("DD MMM YYYY")}</p>
                </div>

                <OutlineButton title="Close" onClick={onClose} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default VoucherCodeModal;
