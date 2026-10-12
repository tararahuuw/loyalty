import React from "react";
import KonnekLogo from "../../assets/konnek_logo.png";
import error from "../../assets/logo_error_page.png";

const ExpiredPage = () => {
  return (
    <div className="flex items-center justify-center bg-white sm:py-6 py-0 h-screen">
      <div className="flex flex-col justify-end gap-24 sm:w-80 w-full h-full px-4 py-4">
        <div className="flex flex-col items-center justify-center px-4">
          <img src={error} alt="voucher-expired" className="h-40 w-40" />

          <p className="text-xl font-bold text-black text-center">Voucher Expired</p>

          <p className="text-sm text-neutral300 text-center">Sorry, There are no voucher to redeem at this time</p>
        </div>

        <div className="rounded-full bg-primary50 self-end p-4 cursor-pointer">
          <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ExpiredPage;
