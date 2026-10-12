import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetDetailUserByID, PostLoginUser } from "../../../service/usermanagement/endpoint";
import { TextInput, PrimaryButton, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { mapStateToProps, mapDispatchToProps } from "../../../state/redux";
import { connect } from "react-redux";
import LogoPrezentFull from "../../../assets/images/logo_prezent_full.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "../../../hooks/useDisclosure";

const Login = ({ timerBanned, handleSetTimerBanned, handleSetUserInfo }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .min(5, "Email must be between 5 and 200 characters long")
        .max(200, "Email must be between 5 and 200 characters long")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please use correct email format")
        .required("Email is required"),
      password: yup
        .string()
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Password is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      handlePostLogin();
    },
  });

  const navigateTo = useNavigate();

  useEffect(() => {
    handleGuardNavigation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timerBanned) {
        const now = new Date();
        const bannedUntil = new Date(timerBanned);
        const remainingTime = Math.floor((bannedUntil - now) / 1000); // in seconds

        if (remainingTime > 0) {
          setIsModalOpenResult(true);
          setFlagResult("failed");
          setDataSubtitleModal(`Sorry, too many login attempts. Please try again in ${remainingTime} seconds.`);
        } else {
          setIsModalOpenResult(false);
          clearInterval(timer); // Stop the timer when time is up
        }
      } else {
        setIsModalOpenResult(false);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timerBanned]);

  function handleGuardNavigation() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsUserLogin(true);
      navigateTo("/prezent/campaign");
    } else {
      setIsUserLogin(false);
    }
  }

  function handleNavigateToForgotPassword() {
    navigateTo("/forgot-password");
  }

  function handleNavigateToSignUp() {
    navigateTo("/register");
  }

  function handleNavigateToDashboard() {
    const token = JSON.parse(localStorage.getItem("token"));
    setTimeout(() => {
      if (token) {
        navigateTo("/prezent/campaign");
      } else {
        navigateTo("/");
      }
    }, 500);
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

  async function handlePostLogin() {
    try {
      toggleLoadingModal();
      const request = {
        username: formik.values.username,
        password: formik.values.password,
      };
      var response = await PostLoginUser(request);
      if (response) {
        localStorage.setItem("token", response.data.token);
        handleSetUserInfo({
          userId: response.data.userId,
          userName: response.data.userName,
          roleId: response.data.roleId,
          roleName: response.data.roleName,
          clientId: response.data.companyId,
          divisionId: response.data.divisionId,
          clientName: response.data.companyName,
          divisionName: response.data.divisionName,
          isInternal: response.data.isInternal,
          phoneNumber: response.data.userPhoneNumber,
          email: response.data.userEmail,
        });
        handleSetTimerBanned(0);
        handleNavigateToDashboard();
      }
      toggleLoadingModal();
    } catch (error) {
      toggleLoadingModal();
      if (error && error.response && error?.response?.data?.data?.bannedTime) {
        handleSetTimerBanned(error?.response?.data?.data?.bannedTime);
      }
      if (error && error.response && error.response.data.code == 401) {
        formik.setFieldError("username", "Invalid email. Verify and try again or use a different email.");
      } else if (error && error.response && error.response.data.code == 409) {
        formik.setFieldError(
          "username",
          "Incorrect password or email. Double-check and try again or use 'Forgot Password' to reset."
        );
        formik.setFieldError(
          "password",
          "Incorrect password or email. Double-check and try again or use 'Forgot Password' to reset."
        );
      } else {
        formik.setFieldError("username", "Sorry, unable to login at the moment. Please try again.");
        formik.setFieldError("password", "Sorry, unable to login at the moment. Please try again.");
        handleOpenModalResult("failed", "Sorry, unable to login at the moment. Please try again");
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

          <form className="bg-white rounded-md drop-shadow-md z-10 w-96" onSubmit={formik.handleSubmit}>
            <div className="mt-6 mx-6 flex justify-center">
              <img src={LogoPrezentFull} alt="Logo" />
            </div>
            <div className="mt-4 mx-6">
              <p className="font-semibold text-black text-2xl">Sign In</p>
              <p className="font-normal text-neutral500 text-sm mt-2">Please enter your email and password</p>
            </div>
            <div className="mt-4 mx-6">
              <div>
                <TextInput
                  title="Email"
                  placeholder="Input Email"
                  onChangeInput={(e) => {
                    formik.setFieldValue("username", e.target.value);
                    formik.setFieldTouched("username", true, false);
                  }}
                  footer={
                    (formik.touched.username || formik.submitCount > 0) && formik.errors.username
                      ? formik.errors.username
                      : null
                  }
                  mode={
                    (formik.touched.username || formik.submitCount > 0) && formik.errors.username ? "danger" : "default"
                  }
                  isRequired
                  value={formik.values.username}
                />
              </div>
              <div className="mt-4">
                <TextInput
                  title="Password"
                  placeholder="Input Password"
                  onChangeInput={(e) => {
                    formik.setFieldValue("password", e.target.value);
                    formik.setFieldTouched("password", true, false);
                  }}
                  footer={
                    (formik.touched.password || formik.submitCount > 0) && formik.errors.password
                      ? formik.errors.password
                      : null
                  }
                  isRequired
                  type="password"
                  mode={
                    (formik.touched.password || formik.submitCount > 0) && formik.errors.password ? "danger" : "default"
                  }
                  value={formik.values.password}
                />
              </div>
            </div>
            <div className="my-4 mx-6 flex justify-end">
              <p className="text-primary500 font-medium cursor-pointer" onClick={handleNavigateToForgotPassword}>
                Forgot Password?
              </p>
            </div>
            <div className="mx-6">
              <PrimaryButton type="full" title="Sign in" size="large" isSubmit={true} />
            </div>
            <div className="flex justify-center mx-6 mt-8 mb-6">
              <p className="text-black font-normal">Don't have an account? </p>
              <p className="text-primary500 font-medium cursor-pointer ml-1" onClick={handleNavigateToSignUp}>
                Sign Up
              </p>
            </div>
          </form>

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

          <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
