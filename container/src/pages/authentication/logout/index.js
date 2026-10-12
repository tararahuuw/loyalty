import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../../../state/redux";
import { connect, useDispatch } from "react-redux";
import { PrimaryButton } from "sprint-asia-custom-component";
import LogoLogout from "../../../assets/images/logo_logout.png";

const Logout = ({ handleResetStore, isOpen, onClose = () => {} }) => {
  const navigateTo = useNavigate();
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();

  function handleRemoveData() {
    handleResetStore();
    localStorage.clear();
    onClose();
    navigateTo("/");
  }

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
            <Dialog.Panel className="relative w-72 max-w-5xl bg-white rounded-lg shadow-xl transition-all">
              <div className="text-center py-3 px-6">
                <div className="flex justify-center my-3">
                  <img src={LogoLogout} />
                </div>
                <p className="font-semibold text-lg text-black">Logout from Prezent</p>
                <p className="text-sm text-neutral500">Do you want to logout from your Prezent account?</p>
              </div>
              <div className="bg-gray-50 px-4 flex justify-center text-center mt-2">
                <div>
                  <div className="w-36">
                    <PrimaryButton title="Logout" type="full" size="small" onClick={handleRemoveData} />
                  </div>
                  <div className="mt-2 mb-4">
                    <p onClick={onClose} className="text-sm font-semibold text-primary500 cursor-pointer">
                      Cancel
                    </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
