import React, { useState, useEffect } from "react";
import LogoSidebarFullFull from "../../../assets/images/logo_prezent_full.png";
import { useNavigate } from "react-router-dom";
import { TextInput, PrimaryButton, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { PostForgotPasswordUser } from "../../../service/usermanagement/endpoint";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useFormik } from "formik";
import * as yup from "yup";

const ForgotPassword = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .min(5, "Email must be between 5 and 200 characters long")
        .max(200, "Email must be between 5 and 200 characters long")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please use correct email format")
        .required("Email is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      handleForgotPassword();
    },
  });

  const navigateTo = useNavigate();

  useEffect(() => {
    handleGuardNavigation();
  }, []);

  function handleGuardNavigation() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsUserLogin(true);
      navigateTo("/myloyalty/dashboard");
    } else {
      setIsUserLogin(false);
    }
  }

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

  async function handleForgotPassword() {
    try {
      toggleLoadingModal();
      const request = {
        email: formik.values.email,
      };
      await PostForgotPasswordUser(request);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Password reset link has been sent. Kindly check your email!");
        setTimeout(() => {
          handleNavigateToLogin();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      if (error && error.request && error.request.status == 404) {
        formik.setFieldError("email", "Email not registered. Double-check or sign up. Need help? Contact support.");
      } else {
        formik.setFieldError("email", "Sorry, we are unable to send reset email at the moment. Please try again");
        handleOpenModalResult("failed", "Sorry, we are unable to send reset email at the moment. Please try again");
      }
    }
  }

  return (
    <>
      {isUserLogin ? (
        <div className="w-screen h-screen bg-white"></div>
      ) : (
        <div className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-neutral20">
          <div className="bg-primary50 h-1/2 w-full absolute bottom-0 transform -skew-y-6"></div>
          <div className="bg-primary50 h-1/4 w-full absolute bottom-0"></div>

          <div className="bg-white rounded-md drop-shadow-md z-10 w-96">
            <div className="mt-8 mx-6 flex justify-center">
              <img src={LogoSidebarFullFull} alt="Logo" />
            </div>
            <div className="mt-6 mx-6">
              <p className="font-semibold text-black text-2xl">Create New Password</p>
            </div>
            <div className="mt-8 mx-6">
              <div>
                <TextInput
                  title="Email"
                  placeholder="Input Email"
                  onChangeInput={(e) => {
                    formik.setFieldValue("email", e.target.value);
                    formik.setFieldTouched("email", true, false);
                  }}
                  footer={
                    (formik.touched.email || formik.submitCount > 0) && formik.errors.email ? formik.errors.email : null
                  }
                  mode={(formik.touched.email || formik.submitCount > 0) && formik.errors.email ? "danger" : "default"}
                  isRequired
                  value={formik.values.email}
                />
              </div>
            </div>
            <div className="mx-6 mt-6">
              <PrimaryButton
                type="full"
                title="Send Reset Password Instruction"
                size="large"
                onClick={formik.handleSubmit}
              />
            </div>
            <div className="mx-6 mt-6">
              <p className="font-normal text-neutral500 text-sm mt-2">
                We'll send verification code to this email if it matches an existing account. Please check the spam box
                if you did not receive an email to reset the password inbox.
              </p>
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
              <a
                className="text-primary500 font-medium cursor-pointer"
                href="https://sprintasia.co.id/"
                target="_blank"
              >
                Help Center
              </a>
            </div>
          </div>

          <ModalLoading
            title="Loading..."
            subtitle="Please wait a moment"
            isOpen={loadingModalIsOpen}
            onClose={() => {}}
          />

          <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
