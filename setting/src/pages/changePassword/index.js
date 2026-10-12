import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextInput,
  ModalLoading,
  ModalResult,
} from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import PrimaryButton from "../../components/button/primarybutton";
import { ChangePasswordUser } from "../../service/usermanagement/endpoint";

const ChangePassword = ({ roleAccess, setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1500);
    }, 250);
  }

  const submitChangePassword = async (values) => {
    try {
        toggleLoadingModal();
        await ChangePasswordUser({oldPassword: values.currentPassword, newPassword: values.newPassword});
        toggleLoadingModal();
        handleOpenModalResult(
            "success",
            "Password has been successfully changes."
        );
        formik.resetForm()
    } catch (error) {
        toggleLoadingModal();
        if (error && error.response && error.response.data.data === "Old password is incorrect") {
            handleOpenModalResult(
                "failed",
                "Current password is incorrect"
            );
        } else {
            handleOpenModalResult(
                "failed",
                "Sorry, we are unable to changes password at the moment. Please refresh the page and try again"
            );
        }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: yup.object().shape({
      currentPassword: yup
        .string()
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Current password is required"),
      newPassword: yup
        .string()
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("New password is required"),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Confirm new password does not match")
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Confirm new password is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
        submitChangePassword(values);
    },
  });

  useEffect(() => {
    setTitleHeader("Change Password");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-3">
            <div className="mb-2">
                <div class="grid grid-cols-3 gap-4 w-full mt-2">
                    <TextInput
                        title="Current Password"
                        placeholder="Input Current Password"
                        onChangeInput={(e) => {
                          formik.setFieldValue("currentPassword", e.target.value);
                          formik.setFieldTouched("currentPassword", true, false);
                        }}
                        footer={(formik.touched.currentPassword || formik.submitCount > 0) && formik.errors.currentPassword ? formik.errors.currentPassword : null}
                        mode={(formik.touched.currentPassword || formik.submitCount > 0) && formik.errors.currentPassword ? "danger" : "default"}
                        isRequired
                        type="password"
                        value={formik.values.currentPassword}
                    />
                </div>
                <div class="grid grid-cols-3 gap-4 w-full mt-2">
                    <TextInput
                        title="New Password"
                        placeholder="Input New Password"
                        onChangeInput={(e) => {
                          formik.setFieldValue("newPassword", e.target.value);
                          formik.setFieldTouched("newPassword", true, false);
                        }}
                        footer={(formik.touched.newPassword || formik.submitCount > 0) && formik.errors.newPassword ? formik.errors.newPassword : null}
                        mode={(formik.touched.newPassword || formik.submitCount > 0) && formik.errors.newPassword ? "danger" : "default"}
                        isRequired
                        type="password"
                        value={formik.values.newPassword}
                    />
                </div>
                <div class="grid grid-cols-3 gap-4 w-full mt-2">
                    <TextInput
                        title="Confirm New Password"
                        placeholder="Input Confirm New Password"
                        onChangeInput={(e) => {
                          formik.setFieldValue("confirmNewPassword", e.target.value);
                          formik.setFieldTouched("confirmNewPassword", true, false);
                        }}
                        footer={(formik.touched.confirmNewPassword || formik.submitCount > 0) && formik.errors.confirmNewPassword ? formik.errors.confirmNewPassword : null}
                        mode={(formik.touched.confirmNewPassword || formik.submitCount > 0) && formik.errors.confirmNewPassword ? "danger" : "default"}
                        isRequired
                        type="password"
                        value={formik.values.confirmNewPassword}
                    />
                </div>
                <div className="flex justify-end w-full mt-2">
                    <PrimaryButton title={"Save Password"} onClick={() => formik.handleSubmit()} isActive/>
                </div>
            </div>
          </div>
        </div>
        <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClick={() => {}} />
        <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
      </div>
    </>
  );
};

export default ChangePassword;