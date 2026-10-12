import React, { Fragment, useRef, useState } from "react";
import { PiCoins, PiPackage, PiUsers, PiTag, PiCalendarBlank, PiFileText, PiAlignBottom } from "react-icons/pi";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "prezent/useDisclosure";
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";
import { OutlineButton, Chip } from "sprint-asia-custom-component";
import ResultModal from "prezent/ResultModal";

const DetailGoodsModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  titleButtonLeft = "Close",
  leftAction = onClose,
  data = null,
}) => {
  const cancelButtonRef = useRef(null);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [isActive, setIsActive] = useState(false);

  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={() => isOpen}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => {}} />
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
            <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full">
              <div className="flex justify-between py-3 px-3">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>

              <div className="border-t border-b border-neutral30 py-2 px-2">
                <div className="py-2 px-2">
                  <div className="flex flex-col gap-6 text-sm text-neutral70">
                    <div className="flex items-center rounded-md p-4 w-full" style={{ backgroundColor: "#f5f9fd" }}>
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-20 h-20 rounded-md overflow-hidden">
                          <img
                            src={data?.images?.[0]?.url || ""}
                            alt="Goods Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between w-full">
                            <p className="text-sm text-black font-semibold">{data?.name || "-"}</p>
                            <div className="shrink-0">
                              <Chip
                                title={data?.status}
                                type={data?.status === "Active" || data?.status === "active" ? "success" : "neutral"}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-neutral300">ID: {data?.id || "-"}</p>

                          <div className="flex items-center gap-2">
                            <PiTag className="mr-2" />
                            <span className="text-xs text-neutral300">Category :</span>
                            <span className="text-xs text-neutral300 font-semibold px-2 py-1 bg-neutral20 rounded">
                              {data?.categoryName || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-primary50 rounded-md p-4">
                        <div className="flex">
                          <div className="mr-3">
                            <PiCoins className="w-8 h-8 text-primary500" />
                          </div>
                          <p className="text-sm font-semibold text-primary500">Points Required</p>
                        </div>
                        <p className="text-lg font-semibold text-primary500 mt-1">{data?.pointRequired || 0}</p>
                        <p className="text-xs text-primary500">points</p>
                      </div>

                      <div className="bg-success50 rounded-md p-4">
                        <div className="flex">
                          <div className="mr-3">
                            <PiPackage className="w-8 h-8 text-success500" />
                          </div>
                          <p className="text-sm font-semibold text-success500">Available Stock</p>
                        </div>
                        <p className="text-lg font-semibold text-success500 mt-1">{data?.stock || 0}</p>
                        <p className="text-xs text-success500">units</p>
                      </div>

                      <div className="bg-danger50 rounded-md p-4">
                        <div className="flex">
                          <div className="mr-3">
                            <PiUsers className="w-8 h-8 text-danger500" />
                          </div>
                          <p className="text-sm font-semibold text-danger500">Total Redeemed</p>
                        </div>
                        <p className="text-lg font-semibold text-danger500 mt-1">{data?.redeemedQty}</p>
                        <p className="text-xs text-danger500">times</p>
                      </div>
                    </div>

                    <div className="border border-neutral600 rounded-md p-4">
                      <div className="flex">
                        <PiCalendarBlank className="w-6 h-6 mr-2" />
                        <p className="text-sm text-black font-medium mb-3">Validity Period</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-neutral900">Validity From</p>
                          <p className="text-xs text-neutral300">
                            {data?.startDate ? moment(data?.startDate).format("DD MMM YYYY HH:mm") : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral900">Validity To</p>
                          <p className="text-xs text-neutral300">
                            {data?.endDate ? moment(data?.endDate).format("DD MMM YYYY HH:mm") : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-neutral60 rounded-md p-4">
                      <div className="flex">
                        <PiFileText className="w-6 h-6 mr-2" />
                        <p className="text-sm text-black font-medium mb-3">Description</p>
                      </div>
                      <p className="text-xs text-neutral300">
                        {data?.description ||
                          "This voucher provides customers with a convenient way to redeem their loyalty points for valuable rewards. It can be used according to the terms and conditions specified by the provider."}
                      </p>
                    </div>

                    <div className="border border-neutral20 bg-neutral20 rounded-md p-4">
                      <div className="flex">
                        <PiAlignBottom className="w-6 h-6 mr-2" />
                        <p className="text-sm text-black font-medium mb-3">Usage Statistics</p>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm">
                        <p>
                          <span className="text-xs text-neutral300">Allocated Stock:</span>{" "}
                          <span className="font-semibold">105 units</span>
                        </p>
                        <p>
                          <span className="text-xs text-neutral300">Total Redeemed:</span>{" "}
                          <span className="font-semibold">100 times</span>
                        </p>
                        <p>
                          <span className="text-xs text-neutral300">Remaining Stock:</span>{" "}
                          <span className="font-semibold">5 units</span>
                        </p>
                        <p>
                          <span className="text-xs text-neutral300">Redemption Rate:</span>{" "}
                          <span className="font-semibold">95%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  <div className="ml-2">
                    <OutlineButton title={titleButtonLeft} type="full" size="large" onClick={leftAction} />
                  </div>
                </div>
                <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DetailGoodsModal;
