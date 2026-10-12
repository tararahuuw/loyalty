import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PostResetPasswordUser } from "../../../service/usermanagement/endpoint";
import { TextInput, PrimaryButton, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import LogoPrezentFull from "../../../assets/images/logo_prezent_full.png";
import queryString from "query-string";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "../../../hooks/useDisclosure";

const ResetPassword = () => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

  const location = useLocation();
  const navigateTo = useNavigate();
  const { id, code } = queryString.parse(location.search);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: yup.object().shape({
      newPassword: yup
        .string()
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Password is required"),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Confirm password does not match")
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Confirm password is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      handlePatchResetPassword();
    },
  });

  useEffect(() => {
    if (!id || !code) {
      handleNavigateToLogin();
    }
  }, []);

  function handleNavigateToLogin() {
    navigateTo("/");
  }

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 2000);
    }, 250);
  }

  async function handlePatchResetPassword() {
    try {
      toggleLoadingModal();
      const request = {
        id: id,
        code: code,
        password: formik.values.newPassword,
      };

      await PostResetPasswordUser(request);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Your password has been updated. You can log in with your new password");
        setTimeout(() => {
          handleNavigateToLogin();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      if (error && error.response && error.response.data.code === 404) {
        formik.setFieldError("newPassword", "User not found. Please contact our operation team on help center.");
        formik.setFieldError("confirmNewPassword", "User not found. Please contact our operation team on help center.");
        handleOpenModalResult("failed", "User not found. Please contact our operation team on help center.");
      } else if (error && error.response && error.response.data.code === 400) {
        formik.setFieldError("newPassword", "Code is invalid. Please contact our operation team on help center.");
        formik.setFieldError(
          "confirmNewPassword",
          "Code is invalid. Please contact our operation team on help center."
        );
        handleOpenModalResult("failed", "Code is invalid. Please contact our operation team on help center.");
      } else {
        formik.setFieldError(
          "newPassword",
          "Sorry, we are unable to update the password at the moment. Please try again."
        );
        formik.setFieldError(
          "confirmNewPassword",
          "Sorry, we are unable to update the password at the moment. Please try again."
        );
        handleOpenModalResult("failed", "Sorry, we are unable to update the password at the moment. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-neutral20">
        <div className="bg-primary50 h-1/2 w-full absolute bottom-0 transform -skew-y-6"></div>
        <div className="bg-primary50 h-1/4 w-full absolute bottom-0"></div>

        <div className="bg-white rounded-md drop-shadow-md z-10 w-96">
          <div className="mt-6 mx-6 flex justify-center">
            <img src={LogoPrezentFull} alt="Logo" />
          </div>
          <div className="mt-4 mx-6">
            <p className="font-semibold text-black text-2xl">Create New Password</p>
          </div>
          <div className="mt-4 mx-6">
            <div>
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
            <div className="mt-4">
              <TextInput
                title="Confirm Password"
                placeholder="Input Confirm Password"
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
          </div>
          <div className="mx-6 mt-6">
            <PrimaryButton type="full" title="Reset Password" size="large" onClick={formik.handleSubmit} />
          </div>
          <div className="flex justify-center mt-8 mb-10">
            <p className="text-primary500 font-medium cursor-pointer" onClick={handleNavigateToLogin}>
              Back to log in page
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 z-20 w-full text-center py-2">
          <div className="flex justify-center">
            <p className="text-neutral300">© 2000-2023 PT. Sprint Asia Technology</p>
            <p className="mx-1">|</p>
            <a className="text-primary500 font-medium cursor-pointer" href="https://sprintasia.co.id/" target="_blank">
              Help Center
            </a>
          </div>
        </div>

        <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

        <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
      </div>
    </>
  );
};

export default ResetPassword;
