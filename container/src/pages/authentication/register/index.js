import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostRegisterUser } from "../../../service/usermanagement/endpoint";
import { TextInput, PrimaryButton, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import LogoPrezentFull from "../../../assets/images/logo_prezent_full.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "../../../hooks/useDisclosure";

const Register = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      fullname: yup
        .string()
        .min(10, "Fullname must be between 10 and 20 characters long")
        .max(20, "Fullname must be between 10 and 20 characters long")
        .required("Fullname is required")
        .test("no-numbers", "Fullname must contain alphabets", (value) => !/\d/.test(value))
        .test(
          "no-special-chars",
          "Fullname must contain alphabets",
          (value) => !/[@#%$^&*(){}\[\];'".,?!+=-]/.test(value)
        ),
      email: yup
        .string()
        .min(5, "Email must be between 5 and 200 characters long")
        .max(200, "Email must be between 5 and 200 characters long")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please use correct email format")
        .required("Email is required"),
      phoneNumber: yup
        .string()
        .matches(/^0/, "Phone number must start with 0xx")
        .min(10, "Phone number must be between 10 and 15 characters long")
        .max(15, "Phone number must be between 10 and 15 characters long")
        .required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Confirm password does not match")
        .min(8, "Contains at least 8 characters")
        .matches(/[a-z]/, "Contains upper and lower case letters")
        .matches(/[A-Z]/, "Contains upper and lower case letters")
        .matches(/\d/, "Contain at least 1 numbers")
        .matches(/[@#%$^&*(){}\[\];'".,?!+=-]/, "Contain at least 1 symbols (example: !#$)")
        .required("Confirm password is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handlePostRegister();
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

  async function handlePostRegister() {
    try {
      toggleLoadingModal();
      const request = {
        fullname: formik.values.fullname,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
        password: formik.values.password,
      };
      await PostRegisterUser(request);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          "We've sent an email to the address you provided. Please check your inbox for a verification link to activate your account."
        );
        setTimeout(() => {
          handleNavigateToLogin();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      if (error && error.response && error.response.data.code === 409) {
        if (error.response.data.data === "Phone Number Already Registered") {
          formik.setFieldError(
            "phoneNumber",
            "Your account already registered. Please contact our operation team on help center."
          );
        }
        if (error.response.data.data === "Email Already Registered") {
          formik.setFieldError(
            "email",
            "Your account already registered. Please contact our operation team on help center."
          );
        }
      } else {
        formik.setFieldError(
          "fullname",
          "We couldn't complete your registration. Please check your details and try again."
        );
        formik.setFieldError(
          "email",
          "We couldn't complete your registration. Please check your details and try again."
        );
        formik.setFieldError(
          "phoneNumber",
          "We couldn't complete your registration. Please check your details and try again."
        );
        formik.setFieldError(
          "password",
          "We couldn't complete your registration. Please check your details and try again."
        );
        formik.setFieldError(
          "confirmPassword",
          "We couldn't complete your registration. Please check your details and try again."
        );
        handleOpenModalResult(
          "failed",
          "We couldn't complete your registration. Please check your details and try again."
        );
      }
    }
  }

  return (
    <>
      {isUserLogin ? (
        <div className="w-screen h-screen bg-white"></div>
      ) : (
        <div className="flex flex-col justify-center items-center relative overflow-hidden bg-neutral20">
          <div className="bg-primary50 h-1/2 w-full absolute bottom-0 transform -skew-y-6"></div>
          <div className="bg-primary50 h-1/4 w-full absolute bottom-0"></div>

          <div className="bg-white rounded-md drop-shadow-md z-10 w-96 mt-8">
            <div className="mt-6 mx-6 flex justify-center">
              <img src={LogoPrezentFull} alt="Logo" />
            </div>
            <div className="mt-4 mx-6">
              <p className="font-semibold text-black text-2xl">Sign Up</p>
              <p className="font-normal text-neutral500 text-sm mt-2">
                Enter your detail below to create your account and get started.
              </p>
            </div>
            <div className="mt-4 mx-6">
              <TextInput
                title="Fullname"
                placeholder="Input Fullname"
                onChangeInput={(e) => {
                  formik.setFieldValue("fullname", e.target.value);
                  formik.setFieldTouched("fullname", true, false);
                }}
                footer={
                  (formik.touched.fullname || formik.submitCount > 0) && formik.errors.fullname
                    ? formik.errors.fullname
                    : null
                }
                mode={
                  (formik.touched.fullname || formik.submitCount > 0) && formik.errors.fullname ? "danger" : "default"
                }
                isRequired
                value={formik.values.fullname}
              />
              <div className="mt-4">
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
              <div className="mt-4">
                <TextInput
                  title="Phone Number"
                  placeholder="Input Phone Number"
                  onChangeInput={(e) => {
                    formik.setFieldValue("phoneNumber", e.target.value);
                    formik.setFieldTouched("phoneNumber", true, false);
                  }}
                  footer={
                    (formik.touched.phoneNumber || formik.submitCount > 0) && formik.errors.phoneNumber
                      ? formik.errors.phoneNumber
                      : null
                  }
                  mode={
                    (formik.touched.phoneNumber || formik.submitCount > 0) && formik.errors.phoneNumber
                      ? "danger"
                      : "default"
                  }
                  isRequired
                  type="number"
                  value={formik.values.phoneNumber}
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
                  mode={
                    (formik.touched.password || formik.submitCount > 0) && formik.errors.password ? "danger" : "default"
                  }
                  isRequired
                  type="password"
                  value={formik.values.password}
                />
              </div>
              <div className="mt-4">
                <TextInput
                  title="Confirm Password"
                  placeholder="Input Confirm Password"
                  onChangeInput={(e) => {
                    formik.setFieldValue("confirmPassword", e.target.value);
                    formik.setFieldTouched("confirmPassword", true, false);
                  }}
                  footer={
                    (formik.touched.confirmPassword || formik.submitCount > 0) && formik.errors.confirmPassword
                      ? formik.errors.confirmPassword
                      : null
                  }
                  mode={
                    (formik.touched.confirmPassword || formik.submitCount > 0) && formik.errors.confirmPassword
                      ? "danger"
                      : "default"
                  }
                  isRequired
                  type="password"
                  value={formik.values.confirmPassword}
                />
              </div>
            </div>
            <div className="mx-6 mt-6">
              <PrimaryButton type="full" title="Sign up" size="large" onClick={formik.handleSubmit} />
            </div>
            <div className="flex justify-center mx-6 mt-8 mb-6">
              <p className="text-black font-normal">Already have an account? </p>
              <p className="text-primary500 font-medium cursor-pointer ml-1" onClick={handleNavigateToLogin}>
                Login
              </p>
            </div>
          </div>

          <div className="z-50 w-full text-center py-2 my-4">
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

export default Register;
