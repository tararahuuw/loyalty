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
    // Defensive JSON.parse: a token written before the JSON.stringify fix (or corrupted some
    // other way) would throw here and crash the whole page with a blank/error overlay instead
    // of just showing the login form. Treat anything unparsable as "not logged in".
    let token = null;
    try {
      token = JSON.parse(localStorage.getItem("token"));
    } catch {
      localStorage.removeItem("token");
    }
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
    let token = null;
    try {
      token = JSON.parse(localStorage.getItem("token"));
    } catch {
      /* treated as logged out below */
    }
    setTimeout(() => {
      if (token) {
        navigateTo("/prezent/campaign");
      } else {
        navigateTo("/");
      }
    }, 500);
  }

  // DEV ONLY: lets you reach the authenticated sidebar/layout locally without a
  // working backend. Gated by NODE_ENV so it never ships in a production build
  // (webpack sets NODE_ENV=production for `npm run build*`).
  function handleDevBypassLogin() {
    // Prefer a real production token (REACT_APP_DEV_TOKEN, set in your local .env.development,
    // gitignored) so API calls actually authenticate against the real backend — falls back to a
    // throwaway fake token if you haven't set one, which will hit real URLs but get 401s.
    const devToken = process.env.REACT_APP_DEV_TOKEN;
    let claims = {};
    if (devToken) {
      try {
        claims = JSON.parse(atob(devToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      } catch {
        claims = {};
      }
    }

    const base64Url = (obj) =>
      btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const fakeToken = `${base64Url({ alg: "none", typ: "JWT" })}.${base64Url({
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    })}.dev-signature`;

    const token = devToken || fakeToken;

    // Exact valueLogin shape captured from a real logged-in session (REACT_APP_DEV_VALUE_LOGIN,
    // gitignored .env.development). Prezent code only reads corporateId/phoneNumber/email off
    // this object, but we keep the full shape for parity with production.
    let valueLogin = {
      corporateId: claims.CorporateId || "dev-corp",
      phoneNumber: claims.PhoneNumber || "081234567890",
      email: claims.Email || "dev@local.test",
    };
    if (process.env.REACT_APP_DEV_VALUE_LOGIN) {
      try {
        valueLogin = JSON.parse(process.env.REACT_APP_DEV_VALUE_LOGIN);
      } catch {
        /* fall back to the claims-derived shape above */
      }
    }

    // Stored JSON.stringify'd — every axios interceptor in every microfrontend reads it back
    // with JSON.parse(localStorage.getItem("token")), so the raw string must match that shape
    // (this mirrors a pre-existing bug in the real login flow below, fixed here too).
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("accessGroupName", JSON.stringify(claims.accessGroupName || "Client Admin - Loyalty"));
    localStorage.setItem("valueLogin", JSON.stringify(valueLogin));
    localStorage.setItem("userName", JSON.stringify(claims.UserName || claims.FullName || "Dev User"));

    handleSetUserInfo({
      userId: claims.UserId || "dev-user-id",
      userName: claims.UserName || claims.FullName || "Dev User",
      roleId: claims.RoleId || "dev-role",
      roleName: "Client Administrator",
      clientId: valueLogin.corporateId,
      divisionId: valueLogin.divisionId || "dev-division",
      clientName: claims.CorporateName || "Dev Client",
      divisionName: valueLogin.divisionName || "Dev Division",
      divisionBillingType: "Prepaid",
      isInternal: false,
      phoneNumber: valueLogin.phoneNumber,
      email: valueLogin.email,
    });

    navigateTo("/prezent/campaign");
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
        // Pre-existing bug fix: every axios interceptor across all microfrontends reads this
        // back with JSON.parse(localStorage.getItem("token")), which throws on a raw JWT
        // string — meaning the Authorization header was silently never attached anywhere.
        localStorage.setItem("token", JSON.stringify(response.data.token));
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
            {process.env.NODE_ENV === "development" && (
              <div className="mx-6 mb-4 -mt-2">
                <button
                  type="button"
                  onClick={handleDevBypassLogin}
                  className="w-full text-center text-xs text-neutral300 underline"
                >
                  Dev only: skip login (no backend needed)
                </button>
              </div>
            )}
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
