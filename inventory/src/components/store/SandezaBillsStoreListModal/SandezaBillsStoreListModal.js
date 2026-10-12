import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "@phosphor-icons/react";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useNavigate } from "react-router-dom";

const SandezaBillsStoreListModal = ({ isOpen, onClose, onClickCancel, merchant, client, stores }) => {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const columns = [
    {
      header: "Outlet Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="text-neutral300 text-sm">{row.code}</p>
            <p className="text-neutral300 text-sm">CODE / ID</p>
          </div>
        );
      },
    },
    {
      header: "Address",
      assessor: "address",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.address}</p>
          </div>
        );
      },
    },
    {
      header: "PIC",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="text-neutral300 text-sm">{row.picPhoneNumber}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "email",
    },
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
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
            <Dialog.Panel className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl py-3 flex flex-col gap-4">
              <div className="flex justify-between border-b border-neutral50 px-6 pb-2">
                <p className="font-semibold text-xl text-black">Connect to SandezaBills</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  <X size={24} />
                </p>
              </div>

              <div className="flex flex-col px-6 py-3 gap-3">
                <p>
                  Found {stores?.length} outlets on {merchant?.name}
                </p>

                <DataTable columns={columns} staticData={stores} options={{ pagination: false, isRounded: true }} />
              </div>

              <div className="flex gap-3 justify-end border-t border-neutral50 px-6 pt-2">
                <OutlineButton title="Cancel" onClick={onClickCancel} />
                <PrimaryButton
                  title="Continue"
                  onClick={() => navigate(`/loyaltypoint/inventory/store/add/${merchant.id}/${client.id}`)}
                />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SandezaBillsStoreListModal;
