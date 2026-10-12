import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { OutlineButton } from "sprint-asia-custom-component";
import moment from "moment";

const ModalRewardReport = ({ isOpen, onClose, selectedData }) => {
  const cancelButtonRef = useRef(null);

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
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
              <Dialog.Panel className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl py-3 flex flex-col gap-4">
                <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
                  <p className="font-semibold text-xl text-black">{selectedData?.rewardName || "-"}</p>
                </div>

                <div className="overflow-y-auto max-h-96 px-6 py-2">
                  <table className="w-full">
                    <thead className="bg-white text-sm">
                      <tr>
                        <th className="p-0 m-0 bg-white">
                          <div className="flex h-16 w-full items-center justify-center font-semibold text-black border-t border-l border-r border-neutral40 rounded-tl-lg">
                            <p>Campaign</p>
                          </div>
                        </th>
                        <th className="p-0 m-0 bg-white">
                          <div className="flex h-16 w-full items-center text-center justify-center font-semibold text-black border-t border-l border-r border-neutral40">
                            <p>Reward Generated</p>
                          </div>
                        </th>
                        <th className="p-0 m-0 bg-white">
                          <div className="flex h-16 w-full items-center text-center justify-center font-semibold text-black border-t border-l border-r border-neutral40 rounded-tr-lg">
                            <p>Reward Redeemed</p>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData?.campaign && selectedData.campaign.length > 0 ? (
                        selectedData.campaign.map((value, index) => (
                          <tr key={index}>
                            <td className="m-0 p-0">
                              <div className="p-2 w-full h-24 pb-8 justify-left flex flex-col border border-neutral40 m-0">
                                <p className="font-semibold">{value.campaignName}</p>
                                <p className="text-neutral300">
                                  {moment(value?.startDateCampaign).format("DD MMM YYYY HH:mm")} -{" "}
                                  {moment(value?.endDateCampaign).format("DD MMM YYYY HH:mm")}
                                </p>
                              </div>
                            </td>
                            <td className="m-0 p-0">
                              <div className="p-2 h-24 justify-center text-center flex w-full border border-neutral40 m-0 text-neutral300">
                                {value.rewardGenerated !== null ? value.rewardGenerated.toLocaleString("id") : "-"}
                              </div>
                            </td>
                            <td className="m-0 p-0">
                              <div className="p-2 h-24 justify-center text-center flex w-full border border-neutral40 m-0 text-neutral300">
                                {value.rewardRedeemed !== null ? value.rewardRedeemed.toLocaleString("id") : "-"}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-neutral300 p-4 border border-neutral40">
                            No Data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                  <OutlineButton title="Close" onClick={onClose} />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ModalRewardReport;
