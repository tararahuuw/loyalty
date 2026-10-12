import React, { useRef, useState } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { CaretDown, NotePencil } from "@phosphor-icons/react";
import { TextInput, PrimaryButton } from "sprint-asia-custom-component";
import DangerButton from "prezent/DangerButton";
import { useFormik } from "formik";
import * as yup from "yup";

const CallBackSection = ({ callbacks, handleCreateCallBacks }) => {
  const contentRef = useRef(null);
  const [editMode, setEditMode] = useState("");
  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(true);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      generatePointUrl: callbacks?.data?.generatePointUrl || "",
      redeemPointUrl: callbacks?.data?.redeemPointUrl || "",
      redeemRewardUrl: callbacks?.data?.redeemRewardUrl || "",
    },
    validationSchema: yup.object().shape({
      generatePointUrl: yup.string().max(200, "Maximum 200 characters").url("Must be a valid URL format"),
      redeemPointUrl: yup.string().max(200, "Maximum 200 characters").url("Must be a valid URL format"),
      redeemRewardUrl: yup.string().max(200, "Maximum 200 characters").url("Must be a valid URL format"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      handleCreateCallBacks(values, setEditMode);
    },
  });

  const handleCancel = () => {
    setEditMode("");
    formik.resetForm();
  };

  const handleEdit = (value) => {
    setEditMode(value);
    formik.resetForm();
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="flex flex-col gap-2 pb-2 border-b border-neutral40">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold leading-6 text-left">URL Callback</p>

          <a className="cursor-pointer" onClick={toggleForm}>
            <CaretDown
              className={`transform ${
                formIsOpen ? "rotate-180" : "rotate-0"
              } transition-transform duration-300 ease-in-out`}
            />
          </a>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: !formIsOpen ? 0 : 2000,
        }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <div className="rounded-t-md rounded-b-md border border-neutral40 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral20 text-neutral500 text-xs font-semibold text-left">
              <tr className="uppercase">
                <th className="p-4 w-3/12">Product</th>
                <th className="p-4">URL</th>
              </tr>
            </thead>

            <tbody>
              <tr className="bg-white">
                <td className="p-4">Generate Point</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <TextInput
                      onChangeInput={(e) => {
                        formik.setFieldValue("generatePointUrl", e.target.value);
                        formik.setFieldTouched("generatePointUrl", true, false);
                      }}
                      value={formik.values.generatePointUrl}
                      footer={
                        (formik.touched.generatePointUrl || formik.submitCount > 0) && formik.errors.generatePointUrl
                          ? formik.errors.generatePointUrl
                          : null
                      }
                      mode={
                        editMode === "generate-point"
                          ? (formik.touched.generatePointUrl || formik.submitCount > 0) &&
                            formik.errors.generatePointUrl
                            ? "danger"
                            : "default"
                          : "disable"
                      }
                    />
                    {editMode === "generate-point" ? (
                      <div className="flex gap-3">
                        <div className="w-24">
                          <DangerButton variant="outlined" title="Cancel" onClick={handleCancel} />
                        </div>
                        <div className="w-24">
                          <PrimaryButton title="Save" type="full" onClick={formik.handleSubmit} />
                        </div>
                      </div>
                    ) : (
                      <a className="cursor-pointer" onClick={() => handleEdit("generate-point")}>
                        <NotePencil size={24} className="text-primary500" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-4">Redeem Point</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <TextInput
                      onChangeInput={(e) => {
                        formik.setFieldValue("redeemPointUrl", e.target.value);
                        formik.setFieldTouched("redeemPointUrl", true, false);
                      }}
                      value={formik.values.redeemPointUrl}
                      footer={
                        (formik.touched.redeemPointUrl || formik.submitCount > 0) && formik.errors.redeemPointUrl
                          ? formik.errors.redeemPointUrl
                          : null
                      }
                      mode={
                        editMode === "redeem-point"
                          ? (formik.touched.redeemPointUrl || formik.submitCount > 0) && formik.errors.redeemPointUrl
                            ? "danger"
                            : "default"
                          : "disable"
                      }
                    />
                    {editMode === "redeem-point" ? (
                      <div className="flex gap-3">
                        <div className="w-24">
                          <DangerButton variant="outlined" title="Cancel" onClick={handleCancel} />
                        </div>
                        <div className="w-24">
                          <PrimaryButton title="Save" type="full" onClick={formik.handleSubmit} />
                        </div>
                      </div>
                    ) : (
                      <a className="cursor-pointer" onClick={() => handleEdit("redeem-point")}>
                        <NotePencil size={24} className="text-primary500" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-4">Redeem Reward</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <TextInput
                      onChangeInput={(e) => {
                        formik.setFieldValue("redeemRewardUrl", e.target.value);
                        formik.setFieldTouched("redeemRewardUrl", true, false);
                      }}
                      value={formik.values.redeemRewardUrl}
                      footer={
                        (formik.touched.redeemRewardUrl || formik.submitCount > 0) && formik.errors.redeemRewardUrl
                          ? formik.errors.redeemRewardUrl
                          : null
                      }
                      mode={
                        editMode === "redeem-reward"
                          ? (formik.touched.redeemRewardUrl || formik.submitCount > 0) && formik.errors.redeemRewardUrl
                            ? "danger"
                            : "default"
                          : "disable"
                      }
                    />
                    {editMode === "redeem-reward" ? (
                      <div className="flex gap-3">
                        <div className="w-24">
                          <DangerButton variant="outlined" title="Cancel" onClick={handleCancel} />
                        </div>
                        <div className="w-24">
                          <PrimaryButton title="Save" type="full" onClick={formik.handleSubmit} />
                        </div>
                      </div>
                    ) : (
                      <a className="cursor-pointer" onClick={() => handleEdit("redeem-reward")}>
                        <NotePencil size={24} className="text-primary500" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CallBackSection;
