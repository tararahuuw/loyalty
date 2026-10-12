import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DangerButton, PrimaryButton, Description } from "sprint-asia-custom-component";

const DashboardTieringModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Loading...",
  status = "Loading...",
  username = "Loading...",
  email = "Loading...",
  phoneNumber = "Loading...",
  clientName = "Loading...",
  division = "Loading...",
  role = "Loading...",
  isVerify = false,
  onClickSendEmail,
  titleButtonLeft = "Cancel",
  titleButtonRight = "Okay",
  leftAction = onClose,
  rightAction = onClose,
  roleAccess,
}) => {
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
            <Dialog.Panel className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl transition-all">
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">{title}</p>
                <p className="cursor-pointer text-xl" onClick={onClose}>
                  x
                </p>
              </div>
              <div className="border-t border-b border-neutral30 py-6">
                <div className="px-6">
                  {roleAccess !== "Client Administrator" && roleAccess !== "Client Support" && (
                    <div className="mb-8">
                      <div className="grid grid-cols-3 gap-4">
                        <Description title="Status" value={status} textColor="success" />
                      </div>
                    </div>
                  )}
                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4">
                      <Description title="Username" value={username ? username : "-"} />
                      <Description
                        title="Email"
                        value={email ? email : "-"}
                        subtitle={isVerify == true ? null : "Email has not been verified"}
                        linkSubtitle={isVerify == true ? null : "Send verify email"}
                        onClickSubtitle={onClickSendEmail}
                      />
                      <Description title="Phone Number" value={phoneNumber ? phoneNumber : "-"} />
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4">
                      {roleAccess !== "Client Administrator" && roleAccess !== "Client Support" && (
                        <Description title="Client" value={clientName ? clientName : "-"} />
                      )}
                      <Description title="Division" value={division ? division : "-"} />
                      <Description title="Role" value={role ? role : "-"} />
                    </div>
                  </div>
                </div>
              </div>
              {roleAccess !== "Client Support" && (
                <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse">
                  <div className="my-3">
                    <div className="ml-2">
                      <PrimaryButton title={titleButtonRight} type="wrap" size="large" onClick={rightAction} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <DangerButton title={titleButtonLeft} type="full" size="large" onClick={leftAction} />
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DashboardTieringModal;
