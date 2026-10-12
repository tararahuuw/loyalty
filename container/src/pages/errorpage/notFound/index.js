import React from "react";
import { PrimaryButton } from "sprint-asia-custom-component";
import LogoErrorPage from "../../../assets/images/logo_error_page.png";

const ErrorPage = () => {

  function handleNavigateToDashboard() {
    window.location.replace("/")
  }
  return (
    <div className="bg-white h-screen">
      {/* <div className="flex w-full h-full items-center justify-center text-center">
        <div>
          <div className="flex justify-center">
            <img src={LogoErrorPage} />
          </div>
          <p className="text-black font-semibold text-xl">404 Page Not Found</p>
          <p className="text-neutral300 font-normal text-sm">Sorry the page you are looking for cannot be found</p>
          <div className="flex justify-center mt-4">
            <PrimaryButton title="Back to dashboard" onClick={handleNavigateToDashboard} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ErrorPage;
