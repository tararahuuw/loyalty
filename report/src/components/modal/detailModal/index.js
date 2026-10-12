import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Description = ({ title = "-", value = "-" }) => {
  return (
    <div className="w-full mb-2">
      <p className="text-sm text-neutral300">{title || "-"}</p>
      <p className="text-sm font-semibold">{value || "-"}</p>
    </div>
  );
};

const DetailModal = ({ isOpen = false, onClose = () => {}, title, data }) => {
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
                  {data?.redeemType === "Address" ? (
                    <div className="border rounded-md border-neutral40 p-4">
                      <p className="font-semibold mb-1">Address Information</p>
                      <hr />
                      <div className="grid grid-cols-3 mt-2">
                        <Description
                          title="Province"
                          value={data?.detailData.find((item) => item.field === "Province")?.value || "-"}
                        />
                        <Description
                          title="City"
                          value={data?.detailData.find((item) => item.field === "City")?.value || "-"}
                        />
                        <Description
                          title="District"
                          value={data?.detailData.find((item) => item.field === "District")?.value || "-"}
                        />
                      </div>
                      <Description
                        title="Postal Code"
                        value={data?.detailData.find((item) => item.field === "Postal Code")?.value || "-"}
                      />
                      <Description
                        title="Street Name, Building, House No."
                        value={data?.detailData.find((item) => item.field === "Address")?.value || "-"}
                      />
                      <Description
                        title="Others Details (e.g Block / Unit No, Landmarks)"
                        value={data?.detailData.find((item) => item.field === "Additional Info")?.value || "-"}
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md border-neutral40 p-4">
                      {data &&
                        data?.detailData &&
                        data?.detailData.map((valueData) => (
                          <Description title={valueData.field} value={valueData.value} />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DetailModal;
