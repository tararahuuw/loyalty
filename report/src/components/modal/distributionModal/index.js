import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";

const DistributionModal = ({ isOpen = false, onClose = () => {}, title, data }) => {
  const cancelButtonRef = useRef(null);

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-10"
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
            <Dialog.Panel className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl transition-all">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-6">
                <div className="px-6">
                  <div className="grid grid-cols-2">
                    <div>
                      <p className="text-neutral300">Voucher Ref ID</p>
                      <p className="font-semibold">{data?.VoucherRefId || "-"}</p>
                    </div>
                    <div>
                      <p className="text-neutral300">Voucher Name</p>
                      <p className="font-semibold">{data?.voucherName || "-"}</p>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <table className="w-full mt-4">
                      <thead>
                        <tr>
                          <th className="p-0">
                            <div className="m-0 py-2 bg-neutral20 text-neutral500 text-sm font-semibold text-center border-t border-l border-neutral40 rounded-tl-md">
                              DISTRIBUTION
                            </div>
                          </th>
                          <th className="p-0">
                            <div className="m-0 py-2 border-t border-neutral40 bg-neutral20 text-neutral500 text-sm font-semibold text-center">
                              STATUS
                            </div>
                          </th>
                          <th className="p-0">
                            <div className="m-0 py-2 border-t border-neutral40 bg-neutral20 text-neutral500 text-sm font-semibold text-center">
                              FEE
                            </div>
                          </th>
                          <th className="p-0">
                            <div className="m-0 py-2 border-t border-r rounded-tr-md border-neutral40 bg-neutral20 text-neutral500 text-sm font-semibold text-center">
                              TIME
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-b border-neutral40">
                        {data &&
                          data.distributions &&
                          data.distributions.map((value, idx) => (
                            <tr key={idx}>
                              <td className="p-0">
                                <div className="m-0 py-2 border-t border-l border-neutral40 bg-white text-neutral500 text-sm font-semibold text-center">
                                  {value.type || "-"}
                                </div>
                              </td>
                              <td className="p-0">
                                <div
                                  className={`m-0 py-2 border-t border-neutral40 bg-white text-sm font-semibold text-center ${
                                    value.status === "success"
                                      ? "text-success500"
                                      : value.status === "failed"
                                      ? "text-danger500"
                                      : "text-black"
                                  }`}
                                >
                                  {value.status || "-"}
                                </div>
                              </td>
                              <td className="p-0">
                                <div className="m-0 py-2 border-t border-neutral40 bg-white text-neutral500 text-sm font-semibold text-center">
                                  {value.fee || "-"}
                                </div>
                              </td>
                              <td className="p-0">
                                <div className="m-0 py-2 border-t border-r border-neutral40 bg-white text-neutral500 text-sm font-semibold text-center">
                                  {value.distribution_time
                                    ? moment(value.distribution_time).format("DD MMM YYYY, HH:mm")
                                    : "-"}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DistributionModal;
