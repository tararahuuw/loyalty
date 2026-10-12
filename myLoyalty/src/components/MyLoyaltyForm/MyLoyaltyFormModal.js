import React, { useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { OutlineButton, PrimaryButton, TextInput } from "sprint-asia-custom-component";
import { Camera, UploadSimple } from "@phosphor-icons/react";

const MyLoyaltyFormModal = ({ isOpen, onClose, formik, handleClick, onChange, validating, disabled }) => {
  const cancelButtonRef = useRef(null);
  const inputLogoRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldTouched("logo", true, false);
    formik.setFieldValue("logo", file);
    setLogoFile(file);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          onClose();
          formik.resetForm();
        }}
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
            <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl py-3 flex flex-col">
              <div className="flex justify-between px-8 py-2">
                <p className="font-semibold text-xl text-black">Create New Loyalty Program</p>
              </div>
              <div className="flex flex-col gap-4 px-8 border-neutral40">
                <p>
                  Please create a new loyalty program with custom branding. A landing page will be automatically
                  generated to support customer engagement.
                </p>

                <TextInput
                  title="Project Name"
                  isRequired={false}
                  placeholder="Enter loyalty program name"
                  value={formik.values.projectName}
                  onChangeInput={(e) => {
                    formik.setFieldValue("projectName", e.target.value);
                    formik.setFieldTouched("projectName", true, false);
                    onChange(e.target.value);
                  }}
                  footer={
                    (formik.touched.projectName || formik.submitCount > 0) && formik.errors.projectName
                      ? formik.errors.projectName
                      : null
                  }
                  mode={
                    disabled
                      ? "disable"
                      : (formik.touched.projectName || formik.submitCount > 0) && formik.errors.projectName
                      ? "danger"
                      : "default"
                  }
                />

                <TextInput
                  title="Description"
                  isRequired={false}
                  placeholder="Describe your loyalty program"
                  value={formik.values.description}
                  onChangeInput={(e) => {
                    formik.setFieldValue("description", e.target.value);
                    formik.setFieldTouched("description", true, false);
                  }}
                  footer={
                    (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                      ? formik.errors.description
                      : null
                  }
                  mode={
                    (formik.touched.description || formik.submitCount > 0) && formik.errors.description
                      ? "danger"
                      : "default"
                  }
                />

                <div>
                  <p>Program Logo</p>
                  <div className="flex items-center gap-4">
                    {formik.values.logo ? (
                      <img
                        src={
                          typeof formik.values.logo === "string"
                            ? formik.values.logo
                            : URL.createObjectURL(formik.values.logo)
                        }
                        className={`w-20 h-20 object-fill rounded-md border ${
                          (formik.touched.logo || formik.submitCount > 0) && formik.errors.logo
                            ? "border-danger500 bg-danger50"
                            : "border-neutral80"
                        } cursor-pointer`}
                        onClick={() => inputLogoRef.current.click()}
                      />
                    ) : (
                      <div
                        className={`border border-dashed ${
                          (formik.touched.logo || formik.submitCount > 0) && formik.errors.logo
                            ? "border-danger500 bg-danger50"
                            : "border-neutral80"
                        } rounded-md w-20 h-20 flex items-center justify-center cursor-pointer`}
                        onClick={() => inputLogoRef.current.click()}
                      >
                        <Camera size={30} className="text-neutral500" />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <a
                          className="cursor-pointer border rounded-md border-neutral80 py-2 px-4 flex items-center gap-1"
                          onClick={() => inputLogoRef.current.click()}
                        >
                          <UploadSimple />
                          <p className="font-semibold">Upload Logo</p>
                        </a>

                        <a className="cursor-pointer font-semibold" onClick={() => setLogoFile(null)}>
                          Remove
                        </a>
                      </div>

                      <p>Maximum file size: 5MB, PNG or JPG format</p>
                    </div>
                  </div>

                  <p className="text-danger500 text-xs">
                    {(formik.touched.logo || formik.submitCount > 0) && formik.errors.logo ? formik.errors.logo : null}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Auto-generated Landing Page URL</p>
                  <div
                    className={`${
                      formik.errors.landingPageURL ? "bg-danger50 text-danger500" : "bg-primary50 text-primary500"
                    } p-2 rounded-md`}
                  >
                    {process.env.NODE_ENV === "development"
                      ? `http://localhost:3001/${formik.values.projectName.toLowerCase().trim().replace(/\s+/g, "-")}`
                      : `https://stagpwa-prezent.sandeza.id/${formik.values.projectName
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")}`}
                    <p className="text-xs text-danger500">{formik.errors.landingPageURL}</p>
                  </div>
                </div>

                <input
                  ref={inputLogoRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>

              <div className="flex items-center gap-4 justify-end px-8 pt-10 pb-3">
                <OutlineButton
                  title="Cancel"
                  onClick={() => {
                    onClose();
                    formik.resetForm();
                  }}
                />
                <PrimaryButton title="Create Program" onClick={handleClick} isActive={!validating} />
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default MyLoyaltyFormModal;
