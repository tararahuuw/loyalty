import React, { Fragment, useRef, useState } from "react";
import { PiArrowRight, PiTrash, PiNotePencil } from "react-icons/pi";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { OutlineButton, Description, DangerButton } from "sprint-asia-custom-component";

const DetailCashbackDiscountModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Title Modal",
  leftAction = onClose,
  rightAction = onClose,
  data = null,
}) => {
  const cancelButtonRef = useRef(null);

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

              <div className="border-t border-b border-neutral30 py-2 px-2 bg-neutral20">
                <div className="m-4 bg-white rounded-lg border border-neutral30">
                  <div className="p-4">
                    <p className="font-semibold mb-1">Status</p>
                    <hr className="w-full text-neutral40 mb-2" />
                    <p className={data?.status === true ? "text-success500" : "text-danger500"}>
                      {data?.name} is {data?.status === true ? "Active" : "not Active"}
                    </p>
                  </div>
                </div>
                <div className="m-4 bg-white rounded-lg border border-neutral30 mt-4">
                  <div className="p-4">
                    <p className="font-semibold mb-1">Goods Information</p>
                    <hr className="w-full text-neutral40 mb-2" />
                    <div className="mb-4">
                      <Description title={"Type"} value={data?.type || "-"} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Description title={`${data?.name} Name`} value={data?.name} />
                      <Description title={"Point Required"} value={data?.pointRequired} />
                      <Description title={`Cashback Percentage (%)`} value={`${data?.percentage}%`} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-span-1">
                        <Description
                          title={`Maximum Amount (IDR)`}
                          value={`Rp${data?.maxAmount ? data?.maxAmount.toLocaleString("id") : 0}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Description
                          title={"Validity Period"}
                          value={
                            <div className="flex items-center">
                              <p>{data?.startDate ? moment(data?.startDate).format("DD MMM YYYY") : "-"}</p>
                              <PiArrowRight className="mx-2" />
                              <p>{data?.endDate ? moment(data?.endDate).format("DD MMM YYYY") : "-"}</p>
                            </div>
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Description title={"Description"} value={data?.description} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                <div className="my-3">
                  <div className="ml-2">
                    <OutlineButton
                      title={
                        <div className="flex items-center gap-1">
                          <PiNotePencil />
                          <p>Edit</p>
                        </div>
                      }
                      type="wrap"
                      size="large"
                      onClick={rightAction}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <DangerButton
                    title={
                      <div className="flex items-center gap-1">
                        <PiTrash />
                        <p>Delete Cashback & Discount</p>
                      </div>
                    }
                    type="full"
                    size="large"
                    onClick={leftAction}
                  />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DetailCashbackDiscountModal;
